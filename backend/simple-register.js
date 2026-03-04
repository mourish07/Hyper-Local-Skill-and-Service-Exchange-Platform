const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Directly define simple User schema to bypass model file issues if any
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    location: String
});
const User = mongoose.model('User', userSchema);

// Hardcode connection string for testing
const MONGO_URI = 'mongodb+srv://mourish28:Mourishr2006@cluster0.qtzzu4s.mongodb.net/skill-exchange?retryWrites=true&w=majority';

const testRegistration = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const userData = {
            name: 'Test User 2',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'user',
            location: 'Test City'
        };

        console.log('Attempting to create user:', userData);

        const user = await User.create(userData);
        console.log('User created successfully:', user);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Registration failed:', error);
    }
};

testRegistration();
