const { Pool } = require('pg');

// Determine if we're in production (Render) or development (local)
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

let pool;

if (isProduction) {
    // Production: Use Neon PostgreSQL on Render
    console.log('🚀 Connecting to Neon PostgreSQL (Production)...');
    console.log('DATABASE_URL exists?', !!process.env.DATABASE_URL);
    
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable is not set!');
        throw new Error('DATABASE_URL not configured');
    }
    
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false  // Required for Neon
        },
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000
    });
} else {
    // Development: Use Local PostgreSQL
    console.log('💻 Connecting to Local PostgreSQL (Development)...');
    pool = new Pool({
        host: process.env.PG_HOST || 'localhost',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'poloko#8',
        database: process.env.PG_DATABASE || 'water',
        port: Number(process.env.PG_PORT || 5432),
        ssl: false
    });
}

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
        console.error('Full error:', err);
    } else {
        const dbType = isProduction ? 'Neon PostgreSQL' : 'Local PostgreSQL';
        console.log(`✅ Connected to ${dbType} successfully`);
        release();
    }
});

// Handle connection errors
pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

module.exports = pool;