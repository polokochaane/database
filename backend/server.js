const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');  // ADD THIS LINE

const customerRoutes = require('./routes/customerRoutes');
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const frontendDir = path.join(__dirname, '..', 'frontend');
const frontendEntry = path.join(frontendDir, 'wasco_water_billing_app.html');

// ========== DEBUGGING CODE - REMOVE LATER ==========
console.log('========== DEBUGGING INFORMATION ==========');
console.log('Current directory (__dirname):', __dirname);
console.log('Frontend directory path:', frontendDir);
console.log('Frontend entry file path:', frontendEntry);
console.log('Does frontend directory exist?', fs.existsSync(frontendDir));

if (fs.existsSync(frontendDir)) {
    console.log('Files in frontend directory:', fs.readdirSync(frontendDir));
} else {
    console.log('❌ frontendDir does NOT exist!');
    
    // Try alternative locations
    const altFrontendDir1 = path.join(__dirname, 'frontend');
    const altFrontendDir2 = path.join(__dirname, '..', '..', 'frontend');
    const altFrontendDir3 = __dirname;
    
    console.log('Checking alternative locations:');
    console.log('  -', altFrontendDir1, 'exists?', fs.existsSync(altFrontendDir1));
    console.log('  -', altFrontendDir2, 'exists?', fs.existsSync(altFrontendDir2));
    console.log('  -', altFrontendDir3, 'exists?', fs.existsSync(altFrontendDir3));
    
    if (fs.existsSync(altFrontendDir1)) {
        console.log('Files in ./frontend:', fs.readdirSync(altFrontendDir1));
    }
    if (fs.existsSync(__dirname)) {
        console.log('Files in root directory:', fs.readdirSync(__dirname));
    }
}
console.log('==========================================\n');
// ========== END OF DEBUGGING CODE ==========

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/customers', customerRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    if (fs.existsSync(frontendEntry)) {
        res.sendFile(frontendEntry);
    } else {
        console.error('❌ File not found:', frontendEntry);
        res.status(404).send(`File not found: ${frontendEntry}`);
    }
});

app.get(/^\/(?!api).*/, (req, res) => {
    if (fs.existsSync(frontendEntry)) {
        res.sendFile(frontendEntry);
    } else {
        res.status(404).send(`File not found: ${frontendEntry}`);
    }
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`WASCO backend running on port ${PORT}`);
});