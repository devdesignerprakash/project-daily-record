import mongoose from 'mongoose';

const routePermitSchema = new mongoose.Schema({ 
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

const RoutePermit = mongoose.model('RoutePermit', routePermitSchema);

export default RoutePermit;
