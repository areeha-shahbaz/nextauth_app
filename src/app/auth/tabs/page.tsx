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
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<0 | 1>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setLoading(true);
    setCurrentTab(newValue as 0 | 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [currentTab]);

  return (
 

    <Box sx={{ minHeight: "100vh",width:"100vw", display: "flex", padding:"0px",
        margin:"0px"
     }}>
      <Header />
  <Box
        sx={{
    width: "100vw",
    maxWidth: "100vw",
    minHeight: "60vh",
    height:"100%",
    mx: "auto",
    maxHeight:"90vh",
    mt: 4,
    p:3,
    borderRadius: 3,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    position: "absolute",     
    left: 0,                    
    right: 0,  
    bottom:0,                 
    overflow: "auto", 
    backgroundColor:"#fff",          
    transition: "opacity 0.3s",
    opacity: loading ? 0.7 : 1,
        }}
      >
    
        <Tabs
          value={currentTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mt:0,
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
            },
          }}
        >
          <Tab label="Products" />
          <Tab label="Users" />
        </Tabs>

        <Box
          sx={{
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            borderRadius: 2,
            p: 2,
            overflow:"visible",

            transition: "opacity 0.3s",
          }}
        >
          {loading ? (
            <CircularProgress size={50} />
          ) : currentTab === 0 ? (
            <ProductPage />
          ) : (
            <AdminPage />
          )}
        </Box>
      </Box>
    </Box>
  );
}
