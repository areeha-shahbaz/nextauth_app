"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState , useEffect} from "react";
import { useDispatch} from "react-redux";
import { login } from "src/store/authSlice";
import {Suspense} from "react";

 function LoginPageInner() {
  const router = useRouter();
  const searchParams= useSearchParams();
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

 useEffect(() => {
  const tokenFromUrl = searchParams.get("token");

 if (tokenFromUrl) {
      setLoading(false);
    return;
    }
    const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token || !user) {
    setLoading(false);
    return;
  } 
  // else {
  //   const parsedUser = JSON.parse(user);
  //   if (parsedUser.mustChangePassword) {
  //     router.replace("/non-auth/reset-password");
  //   } else {
  //     router.replace("/non-auth/welcome");
  //   }
  
  setLoading(false);
}, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

        if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(login(data.user));

      if (data.mustChangePassword) {
        router.push("/non-auth/reset-password");

}

       else {
        router.push("/non-auth/welcome");
      }
    }

    } catch (err) {
      setMessage("Something went wrong");
      console.error(err);
    }
   
  };

  return (
    <div className="container">
      {loading ? <p>Loading...</p>: (



<>   <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p>
  <a href="/non-auth/forgotpassword">Forgot Password?</a>
</p>


        <button type="submit">Log In</button>
      </form>
      <p>{message}</p>
</>
      )}
   
    </div>
  );
}
export default function LoginPage(){
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <LoginPageInner />
    </Suspense>
  );
}

