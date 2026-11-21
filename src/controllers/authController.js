/**
 * Controller Simulasi Login (Opsional sesuai SRS Bagian 3)
 * Hanya simulasi autentikasi agar tidak melanggar aturan satu entitas database.
 */
const loginSimulation = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Simulasi login berhasil',
      data: {
        username,
        token: 'dummy-token-ewaste-veterantech-2026'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memproses login',
      error: error.message
    });
  }
};

module.exports = {
  loginSimulation
};
