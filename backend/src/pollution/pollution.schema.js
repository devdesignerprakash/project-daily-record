import mongoose from 'mongoose';

const pollutionSchema = new mongoose.Schema({ 
    pass:{
        type:Number,
        required:true
    },
    fail:{
        type:Number,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps: true});

const Pollution = mongoose.model('Pollution', pollutionSchema);

export default Pollution;
