import mongoose from 'mongoose';

const roadworthinessSchema = new mongoose.Schema({ 
    roadworthiness_test_done:{
        type:Number,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps: true});

const Roadworthiness = mongoose.model('Roadworthiness', roadworthinessSchema);

export default Roadworthiness;
