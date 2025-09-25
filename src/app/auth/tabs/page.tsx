"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import ProductPage from "src/app/components/productTab"; 
import AdminPage from "src/app/components/admin";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Admin() {
    const[loading, setLoading]=useState(true);
    const [currentTab,setCurrentTab]= useState <0 | 1>(0);
 const handleChange =(event: React.SyntheticEvent, newValue:number)=>{
     setLoading(true);
    setCurrentTab(newValue as 0 | 1);
   
 }
useEffect(()=>{
    const timer = setTimeout(()=>{
        setLoading(false);
    },500);
return () => clearTimeout(timer);
},[currentTab]);

  return (
    <div >
      <Header />
      <Box sx={{ width: "100%", typography: "body1", mt: 3 , height:"100%",}}>
        <h1>Admin Panel</h1>
        <Tabs value ={currentTab}
        
         onChange={handleChange} 
         indicatorColor="primary"
          textColor="primary">
          
        <Tab label = "Products" />
        <Tab label ="Users"/>
        </Tabs>
        <Box sx={{mt:2}}>
            {loading?(
                <Box sx={{display:"flex",justifyContent:"center",mt:5}}>
                <CircularProgress/>
                </Box>
                ) :
                currentTab === 0 ? (<ProductPage/>
                ):(
                <AdminPage/>)
            }
        </Box>
      </Box>
    </div>
  );
}