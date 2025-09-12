// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function ResetPasswordPage() {
//   const router = useRouter();

//   const [newPassword, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [message, setMessage] = useState("");
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const urlParams = new URLSearchParams(window.location.search);
//       const tokenFromUrl = urlParams.get("token");
//       const tokenFromStorage = localStorage.getItem("token"); 
//       const finalToken = tokenFromUrl || tokenFromStorage;
//       setToken(finalToken);
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       setMessage("Token missing. Use a valid reset link or login first.");
//       return;
//     }

//     if (newPassword !== confirm) {
//       setMessage("Passwords do not match.");
//       return;
//     }

//     if (newPassword.length < 6) {
//       setMessage("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       const res = await fetch("/api/users/resetpassword", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, 
//         },
//         body: JSON.stringify({ newPassword }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setMessage("Password has been reset successfully! Redirecting...");
//         setTimeout(() => router.push("/non-auth/login"), 2000);
//       } else {
//         setMessage(data.message || "Something went wrong.");
//       }
//     } catch (err) {
//       console.error("Reset password failed:", err);
//       setMessage("Something went wrong.");
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Reset Password</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           value={newPassword}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirm}
//           onChange={(e) => setConfirm(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={!token}>Reset</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      const tokenFromStorage = localStorage.getItem("token"); 
      const finalToken = tokenFromUrl || tokenFromStorage;
      setToken(finalToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("Token missing. Use a valid reset link or login first.");
      return;
    }

    if (newPassword !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/users/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password has been reset successfully! Redirecting...");
        setTimeout(() => router.push("/non-auth/login"), 2000);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Reset password failed:", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="container">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit" disabled={!token}>Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
