const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllFarmers,
  deleteFarmer,
  getAllCustomers,
  deleteCustomer,
  getAllCrops,
  getAllQueries
} = require('../controllers/adminController');

// All routes protected by JWT + admin role
router.use(protect, adminOnly);

router.get('/farmers', getAllFarmers);
router.delete('/farmers/:id', deleteFarmer);
router.get('/customers', getAllCustomers);
router.delete('/customers/:id', deleteCustomer);
router.get('/crops', getAllCrops);
router.get('/queries', getAllQueries);

module.exports = router;
