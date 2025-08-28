"use client";
import { useRouter } from "next/navigation";
import { useState , useEffect} from "react";

 function LoginPage() {
  const router = useRouter();
  const [loading,setLoading]=useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

    useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);

    }else{
            router.replace("/non-auth/welcome"); 

    }
  }, [router]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      if (data.success) {
      
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/non-auth/welcome");
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

        <button type="submit">Log In</button>
      </form>
      <p>{message}</p>
</>
      )}
   
    </div>
  );
}
export default LoginPage;

