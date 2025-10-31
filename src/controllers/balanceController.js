const db = require('../config/db');
const jwt = require('jsonwebtoken');


exports.getBalance = (req, res) => {
  const userEmail = req.user.email;

  db.query(
    "SELECT balance FROM users WHERE email=$1",
    [userEmail],
    (err, result) => {
      if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });
      if (!result.rows[0]) return res.status(404).json({ status: 1, message: "User tidak ditemukan", data: null });

      res.status(200).json({
        status: 0,
        message: "Berhasil ambil balance",
        data: { balance: result.rows[0].balance }
      });
    }
  );
};

exports.topUp = (req, res) => {
  const { amount } = req.body;

 
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      status: 102,
      message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
      data: null
    });
  }

  const userEmail = req.user.email;


  db.query(
    "UPDATE users SET balance = balance + $1 WHERE email=$2 RETURNING balance",
    [amount, userEmail],
    (err, result) => {
      if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });

      const newBalance = result.rows[0].balance;


      db.query(
        "INSERT INTO transactions (email, service_name, amount) VALUES ($1, $2, $3)",
        [userEmail, "Top Up balance", amount]
      );

      res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: { balance: newBalance }
      });
    }
  );
};


