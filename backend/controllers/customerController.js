const db = require('../config/postgresDB');

const createCustomerTableIfNeeded = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS customers (
            customer_id SERIAL PRIMARY KEY,
            account_number VARCHAR(20) UNIQUE NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            phone VARCHAR(15),
            email VARCHAR(100) UNIQUE,
            address VARCHAR(255),
            district VARCHAR(50),
            date_registered DATE DEFAULT CURRENT_DATE
        );
    `);
};

exports.getAllCustomers = async (req, res) => {
    try {
        await createCustomerTableIfNeeded();
        const result = await db.query(`
            SELECT customer_id, account_number, first_name, last_name, email, phone, address, district, date_registered
            FROM customers
            ORDER BY date_registered DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        await createCustomerTableIfNeeded();
        const { email, account } = req.query;
        if (!email && !account) {
            return res.status(400).json({ error: 'Provide email or account query parameter' });
        }
        const condition = email ? 'email = $1' : 'account_number = $1';
        const value = email || account;
        const result = await db.query(`
            SELECT customer_id, account_number, first_name, last_name, email, phone, address, district, date_registered
            FROM customers
            WHERE ${condition}
            LIMIT 1
        `, [value]);
        if (!result.rows.length) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addCustomer = async (req, res) => {
    try {
        await createCustomerTableIfNeeded();
        const {
            account_number,
            first_name,
            last_name,
            email,
            phone,
            address,
            district
        } = req.body;

        if (!account_number || !email || !first_name || !last_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await db.query(`
            INSERT INTO customers (account_number, first_name, last_name, email, phone, address, district)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (account_number) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                email = EXCLUDED.email,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                district = EXCLUDED.district
            RETURNING customer_id;
        `, [account_number, first_name, last_name, email, phone, address, district]);

        res.status(201).json({ customer_id: result.rows[0].customer_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
