import mongoose,{Schema, model} from "mongoose";
const routeHistorySchema = new Schema({
    
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true},
        from:{
            type:String,
            required:true
        },
        to:{
            type:String,
            required:true
        },
        createdAt:{ type:Date, default: Date.now},
        },
{timestamps: true});

export default mongoose.models.RouteHistory || model("RouteHistory", routeHistorySchema);
