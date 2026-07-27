import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { MODULE_KEYS } from './moduleAccess.constants.js'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    // Which data-entry modules this user may create/update records in.
    // Ignored for admins (they always have full access). Defaults to all
    // modules so accounts created before this field existed keep working.
    allowedModules: {
        type: [String],
        enum: MODULE_KEYS,
        default: MODULE_KEYS,
    },
    // Whether this user may open/print the official letter (LetterModal).
    // Ignored for admins (always allowed). Defaults to true so accounts
    // created before this field existed keep working.
    canPrintLetter: {
        type: Boolean,
        default: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model('User', userSchema);
export default User;