// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function WelcomePage() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) {
//       router.replace("/login"); 
//     } else {
//       setUser(JSON.parse(storedUser));
//     }
//   }, [router]);

//   if (!user) return null; // don’t render until user loaded

//   return (
//     <div className="container">
//       <h1>Welcome {user.name} 🎉</h1>
//       <p>Email: {user.email}</p>
//       <button onClick={() => router.push("/home")}>Go to Home</button>
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    
    <div className="page-container">
        
      <main className="page-main">
        <div className="overlay">
        <h2> Welcome!</h2>
        <p>You have successfully logged in. Click below to go to home page.</p>
        <button onClick={() => router.push("/auth/home")}>Go to Home</button>
        </div>
      </main>
    </div>

  );
}
