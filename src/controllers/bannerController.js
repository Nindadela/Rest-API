const db = require('../config/db');

// Public API Banner
const getBanner = (req, res) => {
  // Raw query prepared statement
  db.query(
    "SELECT banner_name, banner_image, description FROM banners ORDER BY id ASC",
    [],
    (err, result) => {
      if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });

      const banners = result.rows.map(row => ({
        banner_name: row.banner_name,
        banner_image: row.banner_image,
        description: row.description
      }));

      res.json({
        status: 0,
        message: "Sukses",
        data: banners
      });
    }
  );
};

module.exports = { getBanner };
