const db = require('../config/db');

const getProfile = (req, res) => {
    const userEmail = req.user.email;

    db.query(
        "SELECT email, first_name, last_name, profile_image FROM users WHERE email=$1",
        [userEmail],
        (err, result) => {
            if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });
            if (result.rows.length === 0) return res.status(404).json({ status: 1, message: "User tidak ditemukan", data: null });

            const user = result.rows[0];
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: user.profile_image || null
                }
            });
        }
    );
};

const updateProfile = (req, res) => {

    const userEmail = req.user.email;
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({ status: 1, message: "Field first_name dan last_name wajib diisi", data: null });
    }

 
    db.query(
        "UPDATE users SET first_name=$1, last_name=$2 WHERE email=$3 RETURNING email, first_name, last_name, profile_image",
        [first_name, last_name, userEmail],
        (err, result) => {
            if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });
            if (result.rows.length === 0) return res.status(404).json({ status: 1, message: "User tidak ditemukan", data: null });

            const user = result.rows[0];
            res.status(200).json({
                status: 0,
                message: "Update Profile berhasil",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: user.profile_image || null
                }
            });
        }
    );
};


module.exports = { getProfile , updateProfile};
