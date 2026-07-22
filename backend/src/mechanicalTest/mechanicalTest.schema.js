import mongoose from 'mongoose';

const mechanicalTestSchema = new mongoose.Schema({
    count: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const MechanicalTest = mongoose.model('MechanicalTest', mechanicalTestSchema);

export default MechanicalTest;
