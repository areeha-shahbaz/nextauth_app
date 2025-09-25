"use client";
import { useRouter } from "next/navigation";
import { useEffect,useState ,useRef} from "react";
import styles from "./Header.module.css";
import ProfileMenu from "./ProfileMenu";
import {useCart} from "src/app/context/CartContext";

export default function Header() {
  const router = useRouter();
  const [role, setRole]= useState<string | null >(null);
const {cart}=useCart();
  const [dropDownOpen,setdropDownOpen]=useState(false);
  const dropdownRef =useRef<HTMLDivElement>(null);

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
useEffect(()=>{
  function handleClickOutside(event:MouseEvent){
    if(dropdownRef.current&&!dropdownRef.current.contains(event.target as Node)){
      setdropDownOpen(false);
    }
  }
  document.addEventListener("mousedown",handleClickOutside);
  return ()=>{
    document.removeEventListener("mousedown",handleClickOutside);
  };
},[]);
      const totalItems =cart.reduce((sum,item)=>sum +item.quantity,0);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>LOGO</div>
      <nav className={styles.nav}>
        <button className={styles.navBtn} onClick={()=> router.push("/auth/map")}>
          Map
        </button> 
           <button className={styles.navBtn} onClick={()=> router.push("/auth/fakeStore")}>
          fakeStore
        </button> 
         <button className={styles.navBtn} onClick={()=> router.push("/auth/docx")}>
          Edit Doc
        </button>
        <button className={styles.navBtn} onClick={() => router.push("/auth/image")}>
        Image Analyzer
      </button>
      <button className={styles.navBtn} onClick={() => router.push("/auth/weather")}>
        Weather Map
      </button>
      {role === "admin" && (
                <button
                  className={styles.navBtn}
                  onClick={() => router.push("/auth/tabs")}
                >
                  Admin Panel
                </button>
              )}
                 <div className={styles.cartWrapper} ref={dropdownRef}>
        <button className={styles.cartBtn} onClick={()=> setdropDownOpen((prev)=>!prev)}>🛒
        {totalItems>0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </button>
        {dropDownOpen &&(
          <div className={styles.cartDropdown}>
            {cart.length === 0 ?(
              <p>Cart is empty</p>
            ):(
              <><ul>
{cart.map((item)=>(
  <li key={item.id}>
    {item.title}   x{item.quantity}
  </li>
))}
              </ul>
              <button className={styles.checkoutBtn}
              onClick={()=>{
                setdropDownOpen(false);
                router.push("/auth/cart")
              }}>
                Checkout 🛒
              </button>
              </>
            )}
            </div>
        )}
      </div>
         <ProfileMenu />
      </nav>
    </header>
  );
}

