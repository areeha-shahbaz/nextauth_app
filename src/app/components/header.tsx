"use client";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import styles from "./Header.module.css";
import ProfileMenu from "./ProfileMenu";


export default function Header() {
  const router = useRouter();
  const [role, setRole]= useState<string | null >(null);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   router.push("/login");
  // };
  
useEffect(()=>{
  const user = localStorage.getItem("user");
  if(user){
    try{
      const parsedUser = JSON.parse(user);
      setRole(parsedUser.role);
    }catch(e){
      console.error("Invalid User in localStorage");
    }
  }
},[]);


  return (
    <header className={styles.header}>
      <div className={styles.logo}>LOGO</div>
      <nav className={styles.nav}>
        <button className={styles.navBtn} onClick={() => router.push("/image")}>
        Image Analyzer
      </button>
      <button className={styles.navBtn} onClick={() => router.push("/weather")}>
        Weather Map
      </button>
      {role === "admin" && (
                <button
                  className={styles.navBtn}
                  onClick={() => router.push("/auth/admin")}
                >
                  Admin Panel
                </button>
              )}
        {/* <button className={styles.navBtn} onClick={() => alert("Contact coming soon!")}>Contact</button> */}
        {/* <button className={styles.logoutBtn} onClick={handleLogout}> | Logout</button> */}
         <ProfileMenu />
      </nav>
    </header>
  );
}

