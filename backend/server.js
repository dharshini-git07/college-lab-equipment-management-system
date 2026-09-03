const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');
const equipmentRoutes = require('./routes/equipmentRoutes');

dotenv.config({ path: path.join(__dirname, '.env') });

const expressApplication = express();

connectDatabase();

expressApplication.use(cors());
expressApplication.use(express.json());

expressApplication.use('/api/equipment', equipmentRoutes);

expressApplication.get('/', (request, response) => {
    response.status(200).json({
        success: true,
        message: 'Welcome to College Lab Equipment Management System API',
        endpoints: '/api/equipment'
    });
});

expressApplication.use((request, response) => {
    response.status(404).json({
        success: false,
        message: 'Requested API endpoint not found'
    });
});

const serverPort = process.env.PORT || 5000;
expressApplication.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});
