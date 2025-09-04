"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/store";
import { logout }  from "src/store/authSlice"
import styles from "./ProfileMenu.module.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    router.push("/login");
  };
  if (!user) return null;

  const avatar = user.profileImage ? (
    <img src={user.profileImage} alt="avatar" className={styles.avatarImg} />
  ) : (
    (user.name || user.email || "?")[0]?.toUpperCase()
  );


  return (
    <div className={styles.profileMenu}>
      <button
        className={styles.profileBtn}
        onClick={() => setOpen((v) => !v)}>
        <span className={styles.avatar}>{avatar}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button
            className={styles.editBtn}  onClick={() => {
              setOpen(false);
              router.push("/non-auth/editprofile");
            }}>
            Edit Profile
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

