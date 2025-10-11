// "use client";
// import { useEffect } from "react";
// import { useCart } from "src/app/context/CartContext";
// export default function Success() {
//     const { clearCart } = useCart();

//   useEffect(() => {
//     clearCart(); 
//   }, [clearCart]);

//   return (
//     <div style ={{backgroundColor:"#ffffffff", height:"180px",width:"300px",borderRadius:"10px",boxShadow:"rgba(0, 0, 0, 0.56) 0px 22px 70px 4px" }}>
//     <div style={{ textAlign: "center" ,marginTop: "3rem" }}>
//       <h2 style={{color:"darkgreen",fontSize:"25px"}}>Payment Successful!</h2>
//       <br></br>
//       <p>Thank you for your purchase.</p>
//       <a href="/auth/fakeStore" style={{fontStyle:"italic", fontSize:"14px"}}>Continue Shopping</a>
//     </div>
//     </div>
//   );
// }


"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "src/app/context/CartContext";

export default function Success() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div
      style={{
        backgroundColor: "#ffffffff",
        height: "180px",
        width: "300px",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
        margin: "auto",
        marginTop: "8rem",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "darkgreen", fontSize: "25px" }}>
        Payment Successful!
      </h2>
      <p style={{ marginTop: "10px", marginBottom: "20px" }}>
        Thank you for your purchase.
      </p>

      <button
        onClick={() => router.push("/fakeStore")}
        style={{
          display: "inline-block",
          padding: "8px 16px",
          backgroundColor: "teal",
          color: "white",
          borderRadius: "8px",
          fontStyle: "italic",
          fontSize: "14px",
          border: "none",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}
