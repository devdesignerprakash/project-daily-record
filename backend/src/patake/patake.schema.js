import mongoose from 'mongoose';

const patakeSchema = new mongoose.Schema({
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

const Patake = mongoose.model('Patake', patakeSchema);

export default Patake;
