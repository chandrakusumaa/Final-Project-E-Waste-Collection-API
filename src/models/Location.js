const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    namaTempat: {
      type: String,
      required: [true, 'Field namaTempat wajib diisi'],
      trim: true
    },
    alamat: {
      type: String,
      required: [true, 'Field alamat wajib diisi'],
      trim: true
    },
    kategoriSampah: {
      type: [String],
      default: []
    },
    jamOperasional: {
      type: String,
      default: '08.00 - 17.00 WIB',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'locations',
    versionKey: false
  }
);

module.exports = mongoose.model('Location', locationSchema);
