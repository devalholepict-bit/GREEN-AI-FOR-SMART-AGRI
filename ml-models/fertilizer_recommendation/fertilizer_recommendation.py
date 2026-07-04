import pandas as pd
import sys
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier

# Load the dataset
data = pd.read_csv("fertilizer_recommendation.csv")

# Label encoding
le_soil = LabelEncoder()
data['Soil Type'] = le_soil.fit_transform(data['Soil Type'])

le_crop = LabelEncoder()
data['Crop Type'] = le_crop.fit_transform(data['Crop Type'])

# Split input and output
X = data.iloc[:, :8]
y = data.iloc[:, -1]

# Train model
dtc = DecisionTreeClassifier(random_state=0)
dtc.fit(X, y)

# Command line inputs
jsonn = int(sys.argv[1])
jsonp = int(sys.argv[2])
jsonk = int(sys.argv[3])
jsont = int(sys.argv[4])
jsonh = int(sys.argv[5])
jsonsm = int(sys.argv[6])
jsonsoil = sys.argv[7]
jsoncrop = sys.argv[8]

# Encode categorical values
soil_enc = le_soil.transform([jsonsoil])[0]
crop_enc = le_crop.transform([jsoncrop])[0]

# Create dataframe with same column names
user_input = pd.DataFrame(
    [[jsont, jsonh, jsonsm, soil_enc, crop_enc, jsonn, jsonk, jsonp]],
    columns=X.columns
)

# Prediction
fertilizer_name = dtc.predict(user_input)

print(f'Based on the given conditions, the recommended fertilizer is "{fertilizer_name[0]}".')