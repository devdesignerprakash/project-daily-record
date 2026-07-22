import mongoose from 'mongoose';

const fitnessSchema = new mongoose.Schema({ 
    naya:{
        type:Number,
        required:true
    },
    nabikaran:{
        type:Number,
        required:true
    },
    pratilipi:{
        type:Number
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps: true});

const Fitness = mongoose.model('Fitness', fitnessSchema);

export default Fitness;