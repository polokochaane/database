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
const homepageEntry = path.join(frontendDir, 'index.html');        // NEW: Homepage (landing page)
const appEntry = path.join(frontendDir, 'wasco_water_billing_app.html');  // Existing app

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

// Route to serve the main app (dashboard)
app.get('/app', (req, res) => {
    res.sendFile(appEntry, (err) => {
        if (err) {
            console.error('Error sending app file:', err);
            res.status(500).send('Error loading the application');
        }
    });
});

// Route to serve the homepage (landing page)
app.get('/', (req, res) => {
    res.sendFile(homepageEntry, (err) => {
        if (err) {
            console.error('Error sending homepage:', err);
            // Fallback to app if homepage doesn't exist
            res.sendFile(appEntry);
        }
    });
});

// Serve the HTML file for ALL other routes that aren't API
app.get('*', (req, res) => {
    // Don't interfere with API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // If it's a known path, serve the homepage or app
    if (req.path === '/' || req.path === '/home') {
        res.sendFile(homepageEntry);
    } else if (req.path === '/app' || req.path === '/dashboard') {
        res.sendFile(appEntry);
    } else {
        // Default to homepage
        res.sendFile(homepageEntry, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error loading the application');
            }
        });
    }
});

// Use PORT from environment (Render sets this to 10000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`WASCO backend running on port ${PORT}`);
    console.log(`Serving homepage from: ${homepageEntry}`);
    console.log(`Serving app from: ${appEntry}`);
    console.log(`Homepage exists: ${fs.existsSync(homepageEntry)}`);
    console.log(`App exists: ${fs.existsSync(appEntry)}`);
});