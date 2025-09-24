import mongoose , {Schema, model} from "mongoose";
const OrderSchema = new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      items:[
        {
            is:Number,
            title:String,
            price:Number,
            quantity:Number,
        },
      ],
     amount: {type:Number, required:true},
     paymentIntentId:{type:String,required:true},
    status:{type:String,default:"pending"},
    },
    {timestamps:true}
);
export default mongoose.models.Order||model("Order",OrderSchema);
