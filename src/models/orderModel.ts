import mongoose,{Schema, Document} from "mongoose";
interface OrderItem{
    productId:string;
    name:string;
    price:string;
    quantity:number;
}
export interface ItemOrder extends Document{
    userEmail:string;
    items:OrderItem[];
    totalAmount:number;
    status:string;
    createdAt:Date;
}
const OrderSchema= new Schema <ItemOrder>({
    userEmail:{type:String, required:true},
    items:[{
       productId:{type:String,required:true},
       name:{type:String,required:true},
       price:{type:Number, required:true},
 quantity:{type:Number, required:true},
    },],
 totalAmount:{type:Number, required:true},
 status:{type:String,default:"pending"},
},
{timestamps:true}
);
export default mongoose.models.Order || mongoose.model<ItemOrder>("Order",OrderSchema);
