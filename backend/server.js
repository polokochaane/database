const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const customerRoutes = require('./routes/customerRoutes');
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Fix the path - go up one level from backend to src, then into frontend
const frontendDir = path.join(__dirname, '..', 'frontend');
const frontendEntry = path.join(frontendDir, 'wasco_water_billing_app.html');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

// API Routes (must come BEFORE the catch-all route)
app.use('/api/customers', customerRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the HTML file for ALL routes that aren't API
app.get('*', (req, res) => {
    // Don't interfere with API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Send the HTML file
    res.sendFile(frontendEntry, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error loading the application');
        }
    });
});

// Use PORT from environment (Render sets this to 10000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`WASCO backend running on port ${PORT}`);
    console.log(`Serving HTML from: ${frontendEntry}`);
    console.log(`Frontend directory exists: ${fs.existsSync(frontendDir)}`);
    console.log(`HTML file exists: ${fs.existsSync(frontendEntry)}`);
});