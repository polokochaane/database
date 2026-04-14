const db = require('../config/postgresDB');

exports.calculateBills = async (req, res) => {
    try {
        const query = `
            SELECT
                w.customer_id,
                w.usage_id,
                (w.meter_reading_end - w.meter_reading_start) AS total_units,
                ((w.meter_reading_end - w.meter_reading_start) * r.cost_per_unit) AS total_amount
            FROM Water_Usage w
            JOIN Billing_Rates r
            ON (w.meter_reading_end - w.meter_reading_start)
            BETWEEN r.min_usage AND r.max_usage;
        `;

        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOutstandingBills = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM Bills
            WHERE payment_status = 'UNPAID'
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};