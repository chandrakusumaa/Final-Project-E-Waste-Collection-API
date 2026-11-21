const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI belum diatur di dalam file .env');
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Gagal terhubung ke MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
