import mongoose,{Schema, model} from "mongoose";
const docxModelSchema = new Schema({
    
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  data: { type: Buffer, required: true },
  filepath:{type:String, required:true},
  contentType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.docxModel || model("docxModel", docxModelSchema);
