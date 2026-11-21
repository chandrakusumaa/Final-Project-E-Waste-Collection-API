const mongoose = require('mongoose');
const Location = require('../models/Location');

/**
 * @desc    Tambah titik pengumpulan E-Waste baru (Create)
 * @route   POST /api/locations
 */
const createLocation = async (req, res) => {
  try {
    const { namaTempat, nama, alamat, kategoriSampah, jamOperasional } = req.body;

    // Mendukung key "namaTempat" (sesuai skema SRS) maupun alias "nama"
    const resolvedNamaTempat = namaTempat || nama;

    if (!resolvedNamaTempat || ! String(resolvedNamaTempat).trim() || !alamat || !String(alamat).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal: namaTempat dan alamat wajib diisi'
      });
    }

    if (kategoriSampah !== undefined && !Array.isArray(kategoriSampah)) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal: kategoriSampah harus berupa Array of String'
      });
    }

    const newLocation = await Location.create({
      namaTempat: String(resolvedNamaTempat).trim(),
      alamat: String(alamat).trim(),
      kategoriSampah: kategoriSampah || [],
      jamOperasional: jamOperasional || undefined
    });

    return res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan titik pengumpulan E-Waste baru',
      data: newLocation
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validasi data gagal',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat menyimpan data lokasi',
      error: error.message
    });
  }
};

/**
 * @desc    Lihat semua titik pengumpulan E-Waste & pencarian via Query Parameter (Read All)
 * @route   GET /api/locations?search=jakarta
 */
const getAllLocations = async (req, res) => {
  try {
    const { search, kategori } = req.query;
    const filter = {};

    // Pencarian berdasarkan namaTempat atau alamat menggunakan Query Parameter ?search=
    if (search && String(search).trim() !== '') {
      const keyword = String(search).trim();
      filter.$or = [
        { namaTempat: { $regex: keyword, $options: 'i' } },
        { alamat: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Filter opsional tambahan berdasarkan kategoriSampah (?kategori=Baterai)
    if (kategori && String(kategori).trim() !== '') {
      filter.kategoriSampah = { $regex: String(kategori).trim(), $options: 'i' };
    }

    const locations = await Location.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar titik pengumpulan E-Waste',
      count: locations.length,
      data: locations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil data lokasi',
      error: error.message
    });
  }
};

/**
 * @desc    Lihat detail satu titik pengumpulan E-Waste berdasarkan ID (Read One)
 * @route   GET /api/locations/:id
 */
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Mengembalikan 404 jika format ObjectId tidak valid (sesuai spesifikasi SRS)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: `Titik pengumpulan dengan ID ${id} tidak ditemukan (ID tidak valid)`
      });
    }

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Titik pengumpulan dengan ID ${id} tidak ditemukan`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail titik pengumpulan E-Waste',
      data: location
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil detail lokasi',
      error: error.message
    });
  }
};

/**
 * @desc    Ubah data titik pengumpulan E-Waste berdasarkan ID (Update)
 * @route   PUT /api/locations/:id
 */
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: `Titik pengumpulan dengan ID ${id} tidak ditemukan (ID tidak valid)`
      });
    }

    const { namaTempat, nama, alamat, kategoriSampah, jamOperasional } = req.body;
    const resolvedNamaTempat = namaTempat !== undefined ? namaTempat : nama;

    if (resolvedNamaTempat !== undefined && !String(resolvedNamaTempat).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal: namaTempat tidak boleh kosong'
      });
    }

    if (alamat !== undefined && !String(alamat).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal: alamat tidak boleh kosong'
      });
    }

    if (kategoriSampah !== undefined && !Array.isArray(kategoriSampah)) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal: kategoriSampah harus berupa Array of String'
      });
    }

    const updatePayload = {};
    if (resolvedNamaTempat !== undefined) updatePayload.namaTempat = String(resolvedNamaTempat).trim();
    if (alamat !== undefined) updatePayload.alamat = String(alamat).trim();
    if (kategoriSampah !== undefined) updatePayload.kategoriSampah = kategoriSampah;
    if (jamOperasional !== undefined) updatePayload.jamOperasional = String(jamOperasional).trim();

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data perubahan yang dikirimkan pada body request'
      });
    }

    const updatedLocation = await Location.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true
    });

    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        message: `Titik pengumpulan dengan ID ${id} tidak ditemukan`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil memperbarui data titik pengumpulan E-Waste',
      data: updatedLocation
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validasi pembaruan data gagal',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memperbarui data lokasi',
      error: error.message
    });
  }
};

/**
 * @desc    Hapus data titik pengumpulan E-Waste secara permanen berdasarkan ID (Delete)
 * @route   DELETE /api/locations/:id
 */
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: `Titik pengumpulan dengan ID ${id} tidak ditemukan (ID tidak valid)`
      });
    }

    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({
        success: false,
        message: `Titik pengumpulan dengan ID ${id} tidak ditemukan`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data titik pengumpulan E-Waste berhasil dihapus secara permanen',
      data: deletedLocation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat menghapus data lokasi',
      error: error.message
    });
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};
