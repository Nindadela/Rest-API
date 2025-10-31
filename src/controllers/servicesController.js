const db = require('../config/db');

const getServices = (req, res) => {
  db.query("SELECT service_code, service_name, service_icon, service_tariff FROM services", (err, result) => {
    if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });

    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: result.rows
    });
  });
};

module.exports = { getServices };
