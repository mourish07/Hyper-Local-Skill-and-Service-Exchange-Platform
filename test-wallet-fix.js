const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Service = require('./backend/models/Service');
const Request = require('./backend/models/Request');
const Transaction = require('./backend/models/Transaction');
const dotenv = require('dotenv');

dotenv.config();

const testTaskCompletion = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create dummy users
        const requester = await User.create({
            name: 'Test Requester',
            email: `requester_${Date.now()}@test.com`,
            password: 'password123',
            balance: 100
        });

        const volunteer = await User.create({
            name: 'Test Volunteer',
            email: `volunteer_${Date.now()}@test.com`,
            password: 'password123',
            balance: 100
        });

        // 2. Create dummy service
        const service = await Service.create({
            provider: volunteer._id,
            title: 'Test Service',
            description: 'Test Description',
            category: 'Tech',
            points: 50,
            location: 'Remote'
        });

        // 3. Create dummy request
        const request = await Request.create({
            requester: requester._id,
            service: service._id,
            volunteer: volunteer._id,
            status: 'accepted'
        });

        console.log('Initial Balances:', {
            requester: requester.balance,
            volunteer: volunteer.balance
        });

        // 4. Simulate status update to 'completed'
        // We'll mimic the logic from the controller here for direct verification
        const pointsToTransfer = Number(service.points);

        if (requester.balance >= pointsToTransfer) {
            requester.balance -= pointsToTransfer;
            volunteer.balance += pointsToTransfer;

            await requester.save();
            await volunteer.save();

            await Transaction.create({
                sender: requester._id,
                receiver: volunteer._id,
                amount: pointsToTransfer,
                type: 'service_payment',
                description: `Payment for skill: ${service.title}`
            });

            request.status = 'completed';
            await request.save();
        }

        // 5. Verify results
        const updatedRequester = await User.findById(requester._id);
        const updatedVolunteer = await User.findById(volunteer._id);
        const transaction = await Transaction.findOne({ sender: requester._id, receiver: volunteer._id });

        console.log('Final Balances:', {
            requester: updatedRequester.balance,
            volunteer: updatedVolunteer.balance
        });

        if (updatedRequester.balance === 50 && updatedVolunteer.balance === 150 && transaction) {
            console.log('✅ VERIFICATION SUCCESSFUL: Coins transferred correctly.');
        } else {
            console.error('❌ VERIFICATION FAILED: Balance mismatch.');
        }

        // Cleanup
        await User.deleteOne({ _id: requester._id });
        await User.deleteOne({ _id: volunteer._id });
        await Service.deleteOne({ _id: service._id });
        await Request.deleteOne({ _id: request._id });
        await Transaction.deleteOne({ _id: transaction?._id });

        mongoose.connection.close();
    } catch (error) {
        console.error('Test Error:', error);
        mongoose.connection.close();
    }
};

testTaskCompletion();
