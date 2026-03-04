const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // Load env from root

const PORT = 5001; // Use different port to avoid conflict

const runTest = async () => {
    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Start Server
        const server = app.listen(PORT, () => {
            console.log(`Test Server running on port ${PORT}`);
            performRequest();
        });

        const performRequest = async () => {
            const userData = JSON.stringify({
                name: 'Integration Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                role: 'user',
                location: 'Test City'
            });

            const options = {
                hostname: 'localhost',
                port: PORT,
                path: '/api/auth/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': userData.length
                }
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    console.log(`Status Code: ${res.statusCode}`);
                    console.log('Response Body:', data);

                    server.close();
                    mongoose.connection.close();
                    if (res.statusCode === 201) {
                        console.log('TEST PASSED: User registered successfully');
                    } else {
                        console.log('TEST FAILED: Registration failed');
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Request Error:', error);
                server.close();
                mongoose.connection.close();
            });

            req.write(userData);
            req.end();
        };

    } catch (error) {
        console.error('Test Setup Error:', error);
    }
};

runTest();
