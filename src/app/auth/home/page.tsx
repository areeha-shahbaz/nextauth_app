"use client";
import { useRouter } from "next/navigation";
import {requireAuth} from "../../../authCondition";
import { useEffect, useState } from "react";

export default function HomePage() {
  requireAuth();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return <p className="page-main">Loading...</p>;

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="logo" onClick={() => router.push("/auth/home")}>LOGO</div>
        <nav>
          <button onClick={() => router.push("auth/home")}>Home</button>
          <button >Service</button>
          <button>About</button>
          <button onClick={() => alert("Contact coming soon!")}>Contact</button>
          <button onClick={handleLogout}> | Logout</button>
        </nav>
      </header>

      <main className="page-main">
        <div className="overlay">
        <h2>Welcome {user.name} </h2>
        <p>To our company</p>
        <br></br>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quo laudantium quisquam eum a sapiente est delectus libero culpa esse, incidunt ab illo tempora tenetur id facere rerum vel illum.</p>
        <button onClick={()=>router.push("/auth/learnMore")}>Learn More</button>
        </div>
      </main>
    </div>
  );
}
