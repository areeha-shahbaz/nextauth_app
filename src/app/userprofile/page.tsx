"use client";
import React, { useEffect, useState } from "react";
import PgStyles from "./page.module.css";
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage?: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setFormData({ name: data.user.name, email: data.user.email });
      } else {
        setMessage(data.error || "Failed to load profile");
      }
    } catch {
      setMessage("Error fetching profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      if (data.success) fetchProfile();
    } catch {
      setMessage("Error updating profile");
    }
  }

  if (loading) return <p>Loading profile...</p>;

  if (!user) return <p>No profile found.</p>;

  return ( 
  <div className="container">
      <h1>My Profile</h1>
      {message && <p className={PgStyles.message}>{message}</p>}
      <form onSubmit={handleUpdateProfile} className={PgStyles.profileform}>
        <div className={PgStyles.formgroup}>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className={PgStyles.formgroup}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className = {PgStyles.formgroup}>
          <label>Role:</label>
          <span className={PgStyles.info}>{user.role}</span>
        </div>

        <div className={PgStyles.formgroup}>
          <label>Status:</label>
          <span className={PgStyles.info}>{user.status}</span>
        </div>

        <button type="submit" className="btn">
          Update Profile
        </button>
      </form>
    </div>
  );
}
