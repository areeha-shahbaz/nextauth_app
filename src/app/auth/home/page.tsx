"use client";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "../../../authCondition";
import { useEffect, useState } from "react";
import Header from "../../components/header";   
interface User {
  name: string;
}

export default function HomePage() {
  useRequireAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <p className="page-main">Loading...</p>;

  return (
    <div className="page-container">
      <Header />  

      <main className="page-main">
        <div className="overlay">
          <h2>Welcome {user.name}</h2>
          <p>To our company</p>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quo
            laudantium quisquam eum a sapiente est delectus libero culpa esse,
            incidunt ab illo tempora tenetur id facere rerum vel illum.
          </p>
          <button onClick={() => router.push("/auth/learnMore")}>
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
