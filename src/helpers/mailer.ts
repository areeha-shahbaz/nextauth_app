import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import User from "src/models/userModel";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET" | "ADMIN_CREATE";
  userId: string;
  domain?: string;
  tempPassword?: string;
}
const templatePath = path.join(process.cwd(), "src/template/emailTemplate.html");
const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

export const sendEmail = async ({ email, emailType, userId, domain, tempPassword }: SendEmailParams) => {
  try {   
    //  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const user= await User.findById(userId);
  if (!user) throw new Error("User not found");
    const token = jwt.sign(
  {  
     userId: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
  },
  process.env.JWT_SECRET!,
  { expiresIn: "1h" }
);
    // Prepare the update object
    let updateData: any = {};

    if (emailType === "VERIFY") {
      updateData = { emailVerificationToken: token, emailVerificationTokenExpiry: Date.now() + 3600000 };
    } else if (emailType === "RESET") {    
  if (!user.isVerified) {
    throw new Error("User email is not verified. Cannot reset password.");}
      updateData = { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 };
    } else if (emailType === "ADMIN_CREATE") {
      updateData = { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 };
    }

    // Update the user in the database
    await User.findByIdAndUpdate(userId, updateData, { new: true });

    console.log(`Email ${emailType} sent to ${email} with token: ${token}`);

    
 const appDomain = domain || (process.env.NODE_ENV === "production" 
  ? "https://nextauth-app-e19e.vercel.app" 
  : `http://localhost:${process.env.PORT || 3000}`);

  let link="";
  let emailTitle="";
  let emailMessage="";
  let buttonText="";
  let secondarymessage="";
  let  tempPasswordSection="";
  if (emailType==="RESET"){
    link =`${appDomain}/non-auth/reset-password?token=${token}`;
    emailTitle="Forgot your password";
    emailMessage= "It happens to the best of us. To reset your password, click the button below. The link will expire after one hour.";
      buttonText = "Reset password";
      secondarymessage = "If you do not want to change your password or didn't request a reset, you can ignore this email.";
    } else if (emailType === "VERIFY") {
      link = `${appDomain}/non-auth/verifyemail?token=${token}`;
      emailTitle = "Verify Your Email";
      emailMessage = "Thanks for signing up! Please verify your email by clicking the button below.";
      buttonText = "Verify Email";
    } 
   else if (emailType === "ADMIN_CREATE") {
  link = `${appDomain}/non-auth/login`;
  emailTitle = "Your New Account";
  emailMessage = `
    An account has been created for you.<br/><br/>
    Please use the temporary password below to log in and then set a new password.
  `;
  buttonText = "Go To Login";
  secondarymessage = "For security reasons, please change your password after your first login.";
  tempPasswordSection = `<div class="password-box">${tempPassword}</div>`;
}


  const finalHtml = htmlTemplate
    .replaceAll("{{title}}", emailTitle)
    .replaceAll("{{message}}", emailMessage)
    .replaceAll("{{buttonText}}", buttonText)
    .replaceAll("{{link}}", link)
    .replaceAll("{{secondarymessage}}", secondarymessage)
    .replaceAll("{{xLink}}", "https://twitter.com")
    .replaceAll("{{instagramLink}}", "https://instagram.com")
    .replaceAll("{{youtubeLink}}", "https://youtube.com")
    .replaceAll("{{linkedinLink}}", "https://linkedin.com")
    .replaceAll("{{tempPasswordSection}}", tempPasswordSection || "");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ranaareeha62@gmail.com",
        pass: "ftcd pfmx lbrr kyyz",
      },
    });

    const mailOptions = {
      from: "ranaareeha62@gmail.com",
      to: email,
      subject: emailTitle,
      html: finalHtml,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailResponse.response);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};