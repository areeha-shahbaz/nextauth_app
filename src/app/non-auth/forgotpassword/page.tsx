"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit =async (e: React.FormEvent)=>{
    e.preventDefault();
    try{
    const res =await fetch("/api/users/forgotpassword",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email})
    });
    const data =await res.json();
    setMessage(data.message ||data.error);
  }
  catch(error){
      console.error(error);
      setMessage("Something went wrong");

  };
}
  return (
    <div className ="container">
        <h1>Forgot Password</h1>
        <form onSubmit ={handleSubmit}>
            <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange ={(e) => setEmail(e.target.value)}
            required
            />
            
        <button type="submit">Send Reset Link</button>
        </form>
         <p>{message}</p>
    </div>
  );
}
      
