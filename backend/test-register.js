const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: '../.env' });

const testRegistration = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userData = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'user',
            location: 'Test City'
        };

        console.log('Attempting to register:', userData);

        // Check for existing user (shouldn't exist due to unique email)
        const userExists = await User.findOne({ email: userData.email });
        if (userExists) {
            console.log('User already exists (unexpected)');
            process.exit(1);
        }

        const user = await User.create(userData);
        console.log('User created successfully:', user);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Registration failed:', error);
    }
};

testRegistration();
