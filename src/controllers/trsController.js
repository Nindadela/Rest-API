const db = require('../config/db');

const pay = (req, res) => {
    const { service_code } = req.body;
    const userEmail = req.user.email;

    if (!service_code) {
        return res.status(400).json({
            status: 102,
            message: "Service atau Layanan tidak ditemukan",
            data: null
        });
    }


    db.query("SELECT * FROM services WHERE service_code=$1", [service_code], (err, serviceResult) => {
        if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });
        if (serviceResult.rows.length === 0) {
            return res.status(400).json({ status: 102, message: "Service atau Layanan tidak ditemukan", data: null });
        }

        const service = serviceResult.rows[0];
        const amount = service.service_tariff;

 
        db.query("SELECT id, balance FROM users WHERE email=$1", [userEmail], (err, userResult) => {
            if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });
            if (userResult.rows.length === 0) return res.status(404).json({ status: 1, message: "User tidak ditemukan", data: null });

            const user = userResult.rows[0];

            if (user.balance < amount) {
                return res.status(400).json({ status: 102, message: "Saldo tidak cukup", data: null });
            }

    
            db.query("UPDATE users SET balance = balance - $1 WHERE id=$2 RETURNING balance", [amount, user.id], (err) => {
                if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });

         
                db.query(
                    `INSERT INTO transactions 
                    (user_id, service_name, amount, created_at, service_code, transaction_type) 
                    VALUES ($1,$2,$3,NOW(),$4,$5) 
                    RETURNING id, created_at`,
                    [user.id, service.service_name, amount, service.service_code, "PAYMENT"],
                    (err, trxResult) => {
                        if (err) return res.status(500).json({ status: 1, message: "DB Error", data: null });

                        const invoiceNumber = `INV${trxResult.rows[0].id.toString().padStart(6,'0')}`;

                        res.status(200).json({
                            status: 0,
                            message: "Transaksi berhasil",
                            data: {
                                invoice_number: invoiceNumber,
                                service_code: service.service_code,
                                service_name: service.service_name,
                                transaction_type: "PAYMENT",
                                total_amount: amount,
                                created_on: trxResult.rows[0].created_at
                            }
                        });
                    }
                );
            });
        });
    });
};

const getHistory = (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const userEmail = req.user.email;

   
    db.query("SELECT id FROM users WHERE email=$1", [userEmail], (err, userResult) => {
        if (err) return res.status(500).json({ status: 1, message: "DB Error" });
        if (userResult.rows.length === 0) return res.status(404).json({ status: 1, message: "User tidak ditemukan" });

        const userId = userResult.rows[0].id;

        db.query(
            `SELECT id, service_name, amount, created_at, 
             CASE WHEN service_name='Top Up balance' THEN 'TOPUP' ELSE 'PAYMENT' END AS transaction_type
             FROM transactions WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
            [userId, limit, offset],
            (err, result) => {
                if (err) return res.status(500).json({ status: 1, message: "DB Error" });

                const records = result.rows.map(row => ({
                    invoice_number: `INV${row.id.toString().padStart(6,'0')}`,
                    transaction_type: row.transaction_type,
                    description: row.service_name,
                    total_amount: row.amount,
                    created_on: row.created_at
                }));

                res.json({
                    status: 0,
                    message: "Get History Berhasil",
                    data: { offset, limit, records }
                });
            }
        );
    });
};

module.exports = { pay, getHistory };
