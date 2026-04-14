const db = require('../config/postgresDB');

const createUserTableIfNeeded = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            account_number TEXT UNIQUE,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            address TEXT,
            district TEXT,
            connection_type TEXT,
            role TEXT NOT NULL DEFAULT 'customer',
            status TEXT NOT NULL DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
};

exports.getReports = async (req, res) => {
    try {
        await createUserTableIfNeeded();
        const totalResult = await db.query('SELECT COUNT(*) FROM users');
        const customerResult = await db.query("SELECT COUNT(*) FROM users WHERE role = 'customer'");
        const districtResult = await db.query(`
            SELECT district, COUNT(*) AS count
            FROM users
            WHERE role = 'customer' AND district IS NOT NULL
            GROUP BY district
            ORDER BY count DESC
        `);
        const roleResult = await db.query(`
            SELECT role, COUNT(*) AS count
            FROM users
            GROUP BY role
            ORDER BY count DESC
        `);

        res.json({
            totalUsers: parseInt(totalResult.rows[0].count, 10),
            customerCount: parseInt(customerResult.rows[0].count, 10),
            byDistrict: districtResult.rows,
            byRole: roleResult.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};