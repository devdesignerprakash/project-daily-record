import mongoose from 'mongoose';

const monitoringSchema = new mongoose.Schema({
    naya: {
        type: Number,
        required: true,
        default: 0
    },
    nabikaran: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Monitoring = mongoose.model('Monitoring', monitoringSchema);

export default Monitoring;
