// 'use client';
// import { useRouter} from "next/navigation";
// import {useEffect} from "react";
// export function requireAuth(){
//     const router =useRouter();
//   useEffect(()=>{
//     const token =localStorage.getItem("token");
//     if(!token){
//         router.replace("/login");
//     }
//   },[router]);
// }

"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}
