import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import User from "src/models/userModel";
import { v4 as uuidv4 } from "uuid";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
  domain?: string;
}
const templatePath = path.join(process.cwd(), "src/template/emailTemplate.html");
const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

export const sendEmail = async ({ email, emailType, userId, domain }: SendEmailParams) => {
  try {
    const token = uuidv4();

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 });
    }

 const appDomain = domain || (process.env.NODE_ENV === "production" 
  ? "https://nextauth-app-e19e.vercel.app" 
  : `http://localhost:${process.env.PORT || 3000}`);

const link = emailType === "RESET"
  ? `${appDomain}/non-auth/reset-password?token=${token}`
  : `${appDomain}/non-auth/verifyemail?token=${token}`;


    const emailTitle = emailType === "VERIFY" ? "Verify Your Email" : "Forgot your password?";
    const emailMessage = emailType === "VERIFY"
      ? "Thanks for signing up! Please verify your email by clicking the button below."
      : "It happens to the best of us. To reset your password, click the button below. The link will expiry after one hour.";
    const buttonText = emailType === "VERIFY" ? "Verify Email" : "Reset password";
    const secondarymessage = emailType === "RESET"
      ? "If you do not want to change your password or didn't request a reset, you can ignore and delete this email."
      : "";

    const finalHtml = htmlTemplate
      .replaceAll("{{title}}", emailTitle)
      .replaceAll("{{message}}", emailMessage)
      .replaceAll("{{buttonText}}", buttonText)
      .replaceAll("{{link}}", link)
      .replaceAll("{{secondarymessage}}", secondarymessage)
      .replaceAll("{{xLink}}", "https://twitter.com")
      .replaceAll("{{instagramLink}}", "https://instagram.com")
      .replaceAll("{{youtubeLink}}", "https://youtube.com")
      .replaceAll("{{linkedinLink}}", "https://linkedin.com");

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
