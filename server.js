require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const locationRoutes = require('./src/routes/locationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Menghubungkan ke database MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Endpoint (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Selamat datang di REST API Pencarian Titik Pengumpulan Sampah Elektronik (E-Waste) - KSM Veterantech UPNVJ 2026',
    endpoints: {
      loginSimulation: 'POST /api/auth/login',
      createLocation: 'POST /api/locations',
      getAllLocations: 'GET /api/locations (mendukung ?search=keyword)',
      getLocationDetail: 'GET /api/locations/:id',
      updateLocation: 'PUT /api/locations/:id',
      deleteLocation: 'DELETE /api/locations/:id'
    }
  });
});

// Mounting Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);

// Fallback 404 Handler untuk route yang tidak terdaftar
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`
  });
});

// Menjalankan Server
app.listen(PORT, () => {
  console.log(`[Server] REST API E-Waste berjalan pada http://localhost:${PORT}`);
});
