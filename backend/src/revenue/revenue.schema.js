import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Revenue = mongoose.model('Revenue', revenueSchema);

export default Revenue;
