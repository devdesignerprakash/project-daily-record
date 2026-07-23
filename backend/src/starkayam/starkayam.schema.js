import mongoose from 'mongoose';

const starkayamSchema = new mongoose.Schema({
    naya: {
        type: Number,
        required: true
    },
    nabikaran: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Starkayam = mongoose.model('Starkayam', starkayamSchema);

export default Starkayam;
