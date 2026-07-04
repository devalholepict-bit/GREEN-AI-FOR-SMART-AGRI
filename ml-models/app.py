import os
import sys
import json
import io
import pandas as pd
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

# Fix Windows console encoding issues (cp1252 can't handle unicode)
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from collections import Counter

# ==============================
# FLASK APP SETUP
# ==============================
app = Flask(__name__)
CORS(app)

# ==============================
# BASE DIRECTORY (where ml-models/ lives)
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = BASE_DIR

# ==============================
# 1. CROP PREDICTION - Decision Tree (pre-trained pkl)
# ==============================
# Load classes needed for unpickling the decision tree model
class Question:
    def __init__(self, column, value):
        self.column = column
        self.value = value
    def match(self, example):
        val = example[self.column]
        return val == self.value
    def __repr__(self):
        header = ['State_Name', 'District_Name', 'Season', 'Crop']
        return "Is %s %s %s?" % (header[self.column], "==", str(self.value))

class Leaf:
    def __init__(self, Data):
        self.predictions = self._class_counts(Data)
    def _class_counts(self, Data):
        counts = {}
        for row in Data:
            label = row[-1]
            if label not in counts:
                counts[label] = 0
            counts[label] += 1
        return counts

class Decision_Node:
    def __init__(self, question, true_branch, false_branch):
        self.question = question
        self.true_branch = true_branch
        self.false_branch = false_branch

def class_counts(Data):
    counts = {}
    for row in Data:
        label = row[-1]
        if label not in counts:
            counts[label] = 0
        counts[label] += 1
    return counts

def print_leaf(counts):
    total = sum(counts.values()) * 1.0
    probs = {}
    for lbl in counts.keys():
        probs[lbl] = str(int(counts[lbl] / total * 100)) + "%"
    return probs

def classify(row, node):
    if isinstance(node, Leaf):
        return node.predictions
    if node.question.match(row):
        return classify(row, node.true_branch)
    else:
        return classify(row, node.false_branch)

# ==============================
# CROP PREDICTION HELPERS
# ==============================

# The training CSV data for dataset-based lookup
crop_dataset_df = None

# Season mapping to handle common variations
SEASON_MAP = {
    "whole year": "Whole Year",
    "wholr year": "Whole Year",
    "kharif": "Kharif",
    "rabi": "Rabi",
    "summer": "Summer",
    "winter": "Winter",
    "autumn": "Autumn",
}


def preprocess_crop_input(state, district, season):
    """Normalize user input to match training dataset format.
    
    Dataset format:
    - State_Name: Title Case (e.g. "Andaman and Nicobar Islands")
    - District_Name: UPPERCASE (e.g. "NICOBARS")
    - Season: Title Case but may have trailing whitespace (e.g. "Kharif     ")
    """
    # Strip whitespace
    state = state.strip()
    district = district.strip()
    season = season.strip()
    
    # Normalize state: Title Case to match CSV
    state = state.title()
    
    # Normalize district: UPPERCASE to match CSV
    district = district.upper()
    
    # Normalize season: use lookup map, fallback to title case
    season_lower = season.lower()
    if season_lower in SEASON_MAP:
        season = SEASON_MAP[season_lower]
    else:
        season = season.title()
    
    return state, district, season


def check_input_validity(state, district, df):
    """Check if state-district combination exists in training data.
    Returns (is_valid, suggestion_list).
    """
    if df is None:
        return True, []

    # Normalize for matching
    state_matches = df[df['State_Name'].str.strip().str.title() == state]
    valid_districts = state_matches['District_Name'].str.strip().str.upper().unique()
    
    if district not in valid_districts:
        # Return top 5 suggestions
        suggestions = sorted(valid_districts)[:5]
        # Format suggestions nicely (title case for display)
        suggestions = [d.title() for d in suggestions]
        return False, suggestions
    return True, []


def get_top_crops_from_dataset(state, district, season, df, n=3):
    """Look up the most frequent crops grown for the given combination
    from the training CSV data.
    """
    if df is None:
        return None

    # Match using normalized values (season in CSV may have trailing spaces)
    mask = (
        (df['State_Name'].str.strip().str.title() == state) &
        (df['District_Name'].str.strip().str.upper() == district) &
        (df['Season'].str.strip().str.title() == season)
    )
    subset = df[mask]
    
    if len(subset) == 0:
        return None
    
    crop_counts = subset['Crop'].value_counts()
    top_crops = crop_counts.head(n).index.tolist()
    return top_crops


def predict_crop(state, district, season):
    """Full prediction pipeline: preprocess → dataset lookup → fallback to model."""
    state, district, season = preprocess_crop_input(state, district, season)
    
    # First try dataset lookup for most accurate results
    top_crops = get_top_crops_from_dataset(state, district, season, crop_dataset_df, n=3)
    
    if top_crops and len(top_crops) > 0:
        return {
            "crops": top_crops,
            "method": "dataset_lookup",
            "prediction": top_crops[0],
            "state": state,
            "district": district.title(),
            "season": season
        }
    
    # Fallback to ML model (custom decision tree)
    if crop_prediction_model is not None:
        # The model was trained with the raw CSV format — district UPPER, season with spaces
        # We need to pass the format the model was trained on
        testing_data = [[state, district, season]]
        for row in testing_data:
            predict_dict = print_leaf(classify(row, crop_prediction_model)).copy()
        
        top_model_crops = sorted(predict_dict, key=predict_dict.get, reverse=True)[:3]
        return {
            "crops": top_model_crops,
            "method": "ml_model",
            "prediction": top_model_crops[0] if top_model_crops else "Unknown",
            "probabilities": {crop: predict_dict[crop] for crop in top_model_crops},
            "state": state,
            "district": district.title(),
            "season": season
        }
    
    return {
        "crops": [],
        "method": "none",
        "prediction": "Unknown",
        "error": "No model or dataset available"
    }


# ==============================
# ML MODELS INITIALIZATION
# ==============================
crop_prediction_model = None

# Crop Recommendation variables
crop_rec_classifier = None

# Fertilizer Recommendation variables
fert_classifier = None
le_soil = None
le_crop = None
fert_columns = None

# Rainfall variable
rainfall_df = None

# Yield Prediction variables
yield_model = None
yield_ohe = None

def load_all_models():
    global crop_prediction_model, crop_dataset_df
    global crop_rec_classifier
    global fert_classifier, le_soil, le_crop, fert_columns
    global rainfall_df
    global yield_model, yield_ohe

    print("[INFO] Loading ML models...")

    # 1. CROP PREDICTION - Decision Tree (pre-trained pkl) + CSV dataset
    try:
        crop_prediction_model = joblib.load(os.path.join(ML_DIR, 'crop_prediction', 'filetest2.pkl'))
        print("[OK] Crop Prediction model loaded")
    except Exception as e:
        print(f"[FAIL] Crop Prediction model failed to load: {e}")

    # Load CSV dataset for dataset-based lookup
    try:
        csv_path = os.path.join(ML_DIR, 'crop_prediction', 'preprocessed2.csv')
        crop_dataset_df = pd.read_csv(csv_path)
        # Clean up columns: strip whitespace from Season
        if 'Season' in crop_dataset_df.columns:
            crop_dataset_df['Season'] = crop_dataset_df['Season'].str.strip()
        if 'District_Name' in crop_dataset_df.columns:
            crop_dataset_df['District_Name'] = crop_dataset_df['District_Name'].str.strip()
        if 'State_Name' in crop_dataset_df.columns:
            crop_dataset_df['State_Name'] = crop_dataset_df['State_Name'].str.strip()
        if 'Crop' in crop_dataset_df.columns:
            crop_dataset_df['Crop'] = crop_dataset_df['Crop'].str.strip()
        print(f"[OK] Crop dataset loaded: {len(crop_dataset_df)} rows")
        print(f"   States: {crop_dataset_df['State_Name'].nunique()}")
        print(f"   Districts: {crop_dataset_df['District_Name'].nunique()}")
        print(f"   Seasons: {list(crop_dataset_df['Season'].unique())}")
    except Exception as e:
        print(f"[FAIL] Crop dataset failed to load: {e}")

    # 2. CROP RECOMMENDATION - Random Forest (trained on the fly)
    try:
        from sklearn.model_selection import train_test_split
        from sklearn.ensemble import RandomForestClassifier

        crop_rec_dataset = pd.read_csv(os.path.join(ML_DIR, 'crop_recommendation', 'Crop_recommendation.csv'))
        X_rec = crop_rec_dataset.iloc[:, :-1].values
        y_rec = crop_rec_dataset.iloc[:, -1].values
        X_train_rec, X_test_rec, y_train_rec, y_test_rec = train_test_split(X_rec, y_rec, test_size=0.2, random_state=0)
        crop_rec_classifier = RandomForestClassifier(n_estimators=10, criterion='entropy', random_state=0)
        crop_rec_classifier.fit(X_train_rec, y_train_rec)
        print("[OK] Crop Recommendation model loaded")
    except Exception as e:
        print(f"[FAIL] Crop Recommendation model failed: {e}")

    # 3. FERTILIZER RECOMMENDATION - Decision Tree (trained on the fly)
    try:
        from sklearn.preprocessing import LabelEncoder
        from sklearn.tree import DecisionTreeClassifier

        fert_data = pd.read_csv(os.path.join(ML_DIR, 'fertilizer_recommendation', 'fertilizer_recommendation.csv'))
        le_soil = LabelEncoder()
        fert_data['Soil Type'] = le_soil.fit_transform(fert_data['Soil Type'])
        le_crop = LabelEncoder()
        fert_data['Crop Type'] = le_crop.fit_transform(fert_data['Crop Type'])
        X_fert = fert_data.iloc[:, :8]
        y_fert = fert_data.iloc[:, -1]
        fert_classifier = DecisionTreeClassifier(random_state=0)
        fert_classifier.fit(X_fert, y_fert)
        fert_columns = X_fert.columns.tolist()
        print("[OK] Fertilizer model loaded")
    except Exception as e:
        print(f"[FAIL] Fertilizer model failed: {e}")

    # 4. RAINFALL PREDICTION - Statistical average from historical data
    try:
        rainfall_df = pd.read_csv(os.path.join(ML_DIR, 'rainfall_prediction', 'rainfall_in_india_1901-2015.csv'))
        print("[OK] Rainfall model loaded")
    except Exception as e:
        print(f"[FAIL] Rainfall dataset failed to load: {e}")

    # 5. YIELD PREDICTION - Random Forest Regressor (trained on the fly)
    try:
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.preprocessing import OneHotEncoder
        from sklearn.model_selection import train_test_split

        print("[WAIT] Training Yield Prediction model... (this may take a minute)")
        yield_df = pd.read_csv(os.path.join(ML_DIR, 'yield_prediction', 'Crop_Production.csv'))
        yield_df = yield_df.rename(columns={'State': 'State_Name', 'District': 'District_Name'})
        yield_df = yield_df[['State_Name', 'District_Name', 'Season', 'Crop', 'Area', 'Production']]
        yield_df['Area'] = pd.to_numeric(yield_df['Area'], errors='coerce')
        yield_df['Production'] = pd.to_numeric(yield_df['Production'], errors='coerce')
        yield_df = yield_df.dropna()

        X_yield = yield_df.drop(['Production'], axis=1)
        y_yield = yield_df['Production']
        X_train_yield, X_test_yield, y_train_yield, y_test_yield = train_test_split(
            X_yield, y_yield, test_size=0.2, random_state=42
        )

        categorical_cols_yield = ['State_Name', 'District_Name', 'Season', 'Crop']
        yield_ohe = OneHotEncoder(handle_unknown='ignore')
        yield_ohe.fit(X_train_yield[categorical_cols_yield])

        X_train_cat = yield_ohe.transform(X_train_yield[categorical_cols_yield])
        X_train_final_yield = np.hstack((X_train_cat.toarray(), X_train_yield.drop(categorical_cols_yield, axis=1)))

        yield_model = RandomForestRegressor(n_estimators=5, random_state=42, n_jobs=-1)
        yield_model.fit(X_train_final_yield, y_train_yield)
        print("[OK] Yield model loaded")
    except Exception as e:
        print(f"[FAIL] Yield Prediction model failed: {e}")

    print("[READY] All models ready!")
    
    # ==============================
    # MODEL VERIFICATION ON STARTUP
    # ==============================
    print("\n=== Crop Prediction Model Verification ===")
    if crop_prediction_model is not None:
        print(f"Model type: {type(crop_prediction_model)}")
    else:
        print("Model: NOT LOADED (using dataset lookup only)")
    
    if crop_dataset_df is not None:
        print(f"Dataset rows: {len(crop_dataset_df)}")
    
    test_inputs = [
        ("Karnataka", "Udupi", "Kharif"),
        ("Maharashtra", "Pune", "Rabi"),
        ("Punjab", "Amritsar", "Rabi"),
        ("Madhya Pradesh", "Bhopal", "Whole Year"),
        ("Kerala", "Thrissur", "Whole Year"),
    ]
    for state, district, season in test_inputs:
        try:
            result = predict_crop(state, district, season)
            crops = result.get("crops", [])
            method = result.get("method", "unknown")
            print(f"  Test: {state}/{district}/{season} -> {crops[:3]} [{method}]")
        except Exception as e:
            print(f"  Test FAILED for {state}/{district}/{season}: {e}")
    print("==========================================\n")


# ======================================================
# FLASK ROUTES
# ======================================================

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'running',
        'message': 'Agriculture ML Server is running',
        'models': {
            'crop_prediction': crop_prediction_model is not None,
            'crop_dataset': crop_dataset_df is not None,
            'crop_recommendation': crop_rec_classifier is not None,
            'fertilizer_recommendation': fert_classifier is not None,
            'rainfall_prediction': rainfall_df is not None,
            'yield_prediction': yield_model is not None
        }
    })


@app.route('/crop-prediction', methods=['POST'])
def crop_prediction():
    """Predict best crop based on State, District, Season.
    Returns top 3 crops using dataset lookup + ML model fallback.
    """
    try:
        data = request.get_json()
        state = data.get('state', '')
        district = data.get('district', '')
        season = data.get('season', '')

        if not all([state, district, season]):
            return jsonify({'error': 'state, district, and season are required'}), 400

        # Preprocess input
        state_clean, district_clean, season_clean = preprocess_crop_input(state, district, season)

        # Check if state-district combination exists in training data
        is_valid, suggestions = check_input_validity(state_clean, district_clean, crop_dataset_df)

        if not is_valid:
            # Still try to predict, but include a warning
            result = predict_crop(state, district, season)
            result['warning'] = f"District '{district}' not found in training data for {state_clean}."
            if suggestions:
                result['suggested_districts'] = suggestions
                result['warning'] += f" Try: {', '.join(suggestions)}"
            return jsonify(result)

        # Run prediction
        result = predict_crop(state, district, season)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/crop-recommendation', methods=['POST'])
def crop_recommendation():
    """Recommend crop based on soil and weather parameters"""
    try:
        if crop_rec_classifier is None:
            return jsonify({'error': 'Crop recommendation model not ready'}), 500

        data = request.get_json()
        N = float(data.get('N'))
        P = float(data.get('P'))
        K = float(data.get('K'))
        temperature = float(data.get('temperature'))
        humidity = float(data.get('humidity'))
        pH = float(data.get('pH'))
        rainfall = float(data.get('rainfall'))

        user_input = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
        prediction = crop_rec_classifier.predict(user_input)

        return jsonify({
            'recommendation': prediction[0].capitalize(),
            'message': f"The best crop to grow based on the given conditions is {prediction[0].capitalize()}."
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/fertilizer-recommendation', methods=['POST'])
def fertilizer_recommendation():
    """Recommend fertilizer based on soil and crop parameters"""
    try:
        if fert_classifier is None:
            return jsonify({'error': 'Fertilizer recommendation model not ready'}), 500

        data = request.get_json()
        N = int(data.get('N'))
        P = int(data.get('P'))
        K = int(data.get('K'))
        temperature = int(data.get('temperature'))
        humidity = int(data.get('humidity'))
        soil_moisture = int(data.get('soil_moisture'))
        soil_type = data.get('soil_type')
        crop_type = data.get('crop_type')

        soil_enc = le_soil.transform([soil_type])[0]
        crop_enc = le_crop.transform([crop_type])[0]

        user_input = pd.DataFrame(
            [[temperature, humidity, soil_moisture, soil_enc, crop_enc, N, K, P]],
            columns=fert_columns
        )

        fertilizer_name = fert_classifier.predict(user_input)

        return jsonify({
            'recommendation': fertilizer_name[0],
            'message': f'Based on the given conditions, the recommended fertilizer is "{fertilizer_name[0]}".'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/yield-prediction', methods=['POST'])
def yield_prediction():
    """Predict crop yield based on region, season, crop, and area"""
    try:
        if yield_model is None:
            return jsonify({'error': 'Yield prediction model not ready'}), 500

        data = request.get_json()
        state = data.get('state')
        district = data.get('district')
        season = data.get('season')
        crop = data.get('crop')
        area = float(data.get('area'))

        user_input = np.array([[state, district, season, crop, area]])
        user_input_categorical = yield_ohe.transform(user_input[:, :4])
        user_input_final = np.hstack((user_input_categorical.toarray(), user_input[:, 4:].astype(float)))

        prediction = yield_model.predict(user_input_final)

        return jsonify({
            'predicted_yield': round(float(prediction[0]), 2),
            'message': f'Predicted production yield is {round(float(prediction[0]), 2)} tonnes.'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/rainfall-prediction', methods=['POST'])
def rainfall_prediction():
    """Predict average rainfall for a given subdivision and month"""
    try:
        if rainfall_df is None:
            return jsonify({'error': 'Rainfall dataset not loaded'}), 500

        data = request.get_json()
        subdivision = data.get('subdivision')
        month = data.get('month')

        if not subdivision or not month:
            return jsonify({'error': 'subdivision and month are required'}), 400

        state_data = rainfall_df[rainfall_df['SUBDIVISION'] == subdivision]

        if state_data.empty:
            return jsonify({'error': f'No data found for subdivision: {subdivision}'}), 404

        avg_rainfall = state_data[month].mean()

        return jsonify({
            'predicted_rainfall': round(float(avg_rainfall), 2),
            'subdivision': subdivision,
            'month': month,
            'message': f'Average expected rainfall in {subdivision} in {month} is {round(float(avg_rainfall), 2)} mm'
        })
    except KeyError:
        return jsonify({'error': f'Invalid month: {month}. Use uppercase month abbreviations like JAN, FEB, MAR, etc.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==============================
# RUN THE SERVER
# ==============================
if __name__ == '__main__':
    print("\n=== Agriculture ML Flask Server ===")
    print("Running on: http://localhost:5001")
    print("Status: READY\n")
    load_all_models()
    app.run(host='0.0.0.0', port=5001, debug=True)
