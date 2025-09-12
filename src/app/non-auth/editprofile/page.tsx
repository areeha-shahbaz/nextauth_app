"use client";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState,useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store/store";
import { login } from "src/store/authSlice";
import styles from "./EditProfile.module.css";

export default function EditProfilePage() {
  const router=useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
const [email, setEmail] = useState(user?.email || "");
const [profileImage, setProfileImage] = useState("");

useEffect(() => {
  console.log("User data:", user);
  if (user?.profileImage) {
    setProfileImage(user.profileImage);
  }
}, [user]);


useEffect(() => {
  const storedName = localStorage.getItem("name");
  const storedEmail = localStorage.getItem("email");

  if (storedName) setName(storedName);
  if (storedEmail) setEmail(storedEmail);
}, []);

useEffect(() => {
  localStorage.setItem("name", name);
}, [name]);

useEffect(() => {
  localStorage.setItem("email", email);
}, [email]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const updatedUser = { ...user, name, email, profileImage };

    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(login(data.user));
        alert("Profile updated!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("API error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
         <button onClick={() => router.push("/auth/home")} className={styles.backButton}>
        <FaArrowLeft size={24} />
      </button>
        <h1 className={styles.title}>Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
         <div className={styles.avatarWrapper}>
  {profileImage ? (
    <>
      <img
        src={profileImage}
        alt="avatar"
        className={styles.avatar}
        onClick={() => document.getElementById("fileInput")?.click()} 
      />
    </>
  ) : (
    <div
      className={styles.placeholder}
      onClick={() => document.getElementById("fileInput")?.click()}>
      +
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    id="fileInput"
    onChange={handleImageUpload}
    hidden
  />

  <label className={styles.uploadLabel}>
    Change Photo
   
  </label>
</div>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}/>

          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

          <button type="submit" className={styles.saveBtn}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
