"use client";
import { useEffect } from "react";
import { useCart } from "src/app/context/CartContext";
export default function Success() {
    const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); 
  }, [clearCart]);

  return (
    <div style ={{backgroundColor:"#ffffffff", height:"180px",width:"300px",borderRadius:"10px",boxShadow:"rgba(0, 0, 0, 0.56) 0px 22px 70px 4px" }}>
    <div style={{ textAlign: "center" ,marginTop: "3rem" }}>
      <h2 style={{color:"darkgreen",fontSize:"25px"}}>Payment Successful!</h2>
      <br></br>
      <p>Thank you for your purchase.</p>
      <a href="/auth/fakeStore" style={{fontStyle:"italic", fontSize:"14px"}}>Continue Shopping</a>
    </div>
    </div>
  );
}



