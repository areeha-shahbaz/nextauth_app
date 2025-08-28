import connect from "src/dbConnection/dbConnection";
import User from 'src/models/userModel';
import { NextRequest, NextResponse} from 'next/server';
import bcryptjs from "bcryptjs";

const jwt =require("jsonwebtoken");

export async function POST(request:NextRequest) {
    await connect();
    try{
        
       const reqBody = await request.json()
       const { email,password} =reqBody
       const user =await User.findOne({email});
       if(!user){
        return NextResponse.json(
            { error:"user not found"},
                {status:404}
        );
       }
       const isMatch =await bcryptjs.compare(password,user.passwordHash);
       if(!isMatch){
        return NextResponse.json(
            {error:"invalid credentials"},
            {status:401}
        );
       }
       const token= jwt.sign(
        {id: user._id, email:email},
        process.env.JWT_SECRET!,
    { expiresIn: "1h"});       
   
    return NextResponse.json({
      message: "Login successful",
      success: true,
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}