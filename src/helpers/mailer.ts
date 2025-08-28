import nodemailer from 'nodemailer'
import User from 'src/models/userModel';
import bcryptjs from "bcryptjs"

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams)=>{

    try{
       const hashedToken = await bcryptjs.hash(userId.toString(),10)
        if(emailType==="VERIFY"){
            await User.findByIdAndUpdate(userId,
            {verifyToken: hashedToken, verifyTokenExpiry: Date.now() +360000 })
        }else if(emailType==="RESET"){
                await User.findByIdAndUpdate(userId,
            {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() +360000 })

        }
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ranaareeha62@gmail.com",
            pass: "ftcd pfmx lbrr kyyz",
        },
        });   

        const mailOptions ={
                from: 'ranaareeha62@gmail.com',
                to: email,
                subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
                html: `<p> Click<a href="${ process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"} or copy paste the link below in the browser.
                <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
             </p>`, 
        }
        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse
    }
    catch(error){
        console.log('error in connection');
            console.log(error);
        
    }
}