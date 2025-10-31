const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator'); 

exports.register = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;


  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({ status: 1, message: "Semua field wajib diisi" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ status: 1, message: "Format email tidak valid" });
  }

  if (password.length < 8) {
    return res.status(400).json({ status: 1, message: "Password minimal 8 karakter" });
  }

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id, email, first_name, last_name",
    [email, first_name, last_name, hash],
    (err, result) => {
      if (err) {
   
        return res.status(400).json({ status: 1, message: "Email sudah digunakan" });
      }

      res.json({
        status: 0,
        message: "Register berhasil",
        data: result.rows[0]
      });
    }
  );
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 102, message: "Parameter email tidak sesuai format", data: null });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ status: 102, message: "Parameter email tidak sesuai format", data: null });
  }

  if (password.length < 8) {
    return res.status(401).json({ status: 103, message: "Username atau password salah", data: null });
  }

  db.query("SELECT * FROM users WHERE email=$1", [email], async (err, result) => {
    if (err) return res.status(500).json({ status: 1, message: "Terjadi kesalahan server", data: null });

    if (result.rows.length === 0) {
      return res.status(401).json({ status: 103, message: "Username atau password salah", data: null });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: 103, message: "Username atau password salah", data: null });
    }


    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token }
    });
  });
};