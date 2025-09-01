"use client";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>LOGO</div>
      <nav className={styles.nav}>
        <button className={styles.navBtn} onClick={() => router.push("/")}>Home</button>
        <button className={styles.navBtn} >Service</button>
        <button className={styles.navBtn} >About</button>
        <button className={styles.navBtn} onClick={() => alert("Contact coming soon!")}>Contact</button>
        <button className={styles.logoutBtn} onClick={handleLogout}> | Logout</button>
      </nav>
    </header>
  );
}

