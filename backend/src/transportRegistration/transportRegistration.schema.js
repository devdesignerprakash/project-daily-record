import mongoose from 'mongoose';

const transportRegistrationSchema = new mongoose.Schema({
    naya: {
        type: Number,
        default: 0
    },
    nabikaran: {
        type: Number,
        default: 0
    },
    thap: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const TransportRegistration = mongoose.model('TransportRegistration', transportRegistrationSchema);

export default TransportRegistration;
