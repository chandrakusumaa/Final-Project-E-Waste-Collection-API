const express = require('express');
const router = express.Router();
const {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');

// Route: /api/locations
router.route('/')
  .post(createLocation)
  .get(getAllLocations);

// Route: /api/locations/:id (Dynamic Routing)
router.route('/:id')
  .get(getLocationById)
  .put(updateLocation)
  .delete(deleteLocation);

module.exports = router;
