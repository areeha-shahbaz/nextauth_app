import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
     profileImage: {
      type: String, 
      default: "",
    },
     role: {
      type: String,
      enum: ["admin","user"],
      default: "user",
      required: true,
    }, status: {
      type: String,
      enum:["active", "deactive"],
      default: "active",
      required: true,
    },
    mustChangePassword:{
      type:Boolean,
      default:false,
    },
    hasPaid: {
       type: Boolean,
        default: false 
      },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
