"use client";
import React, {useState,useEffect} from "react";
// import  Header from "../header";
type Product ={
    _id?: string;   
  id?: number; 
    title:string;
    price:number;
    image:string;
  
}
export default function ProductTab(){
    const [loading, setLoading]=useState(true);
const [product,setProducts]= useState<Product[]>([]);
const [newProducts, setNewProduct] = useState<{
  title: string;
  price: string;
  image: string | File;
}>({ title: "", price: "", image: "" });

useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);

const handleAddProduct = async () => {
  if (!newProducts.title || !newProducts.price || !newProducts.image) return;

  try {
    const formData = new FormData();
    formData.append("title", newProducts.title);
    formData.append("price", newProducts.price.toString());
    formData.append("image", newProducts.image as File); 
    const res = await fetch("/api/products", {
      method: "POST",
      body: formData, 
    });

    if (!res.ok) throw new Error("Failed to add product");

    const added = await res.json();
    setProducts([added, ...product]);
    setNewProduct({ title: "", price: "", image: "" });
  } catch (err) {
    console.error(err);
  }
};


  if (loading) return <h2>Loading products...</h2>;

  return (
    <div>
      {/* <Header /> */}
      <div style={{backgroundColor:"white", padding:"8px", marginTop:"8%",borderRadius:"14px"}}>
    <h2 style={{paddingTop:"14px",}}>Add New Product</h2>
      <input style={{fontSize:"12px",margin:"5px",padding:"5px",gap:"4px",}}
        type="text"
        placeholder="Title"
        value={newProducts.title}
        onChange={(e) => setNewProduct({ ...newProducts, title: e.target.value })}
      />
      
      <input style={{fontSize:"12px", margin:"5px",padding:"5px", gap:"4px",}}
        type="text"
        placeholder="Price"
        value={newProducts.price}
        onChange={(e) => setNewProduct({ ...newProducts, price: e.target.value })}
      />
      <input style={{fontSize:"12px", margin:"5px",padding:"5px", gap:"4px",}}
        type="file"
        accept ="image/*"
        onChange={(e) =>{
            const file= e.target.files?.[0];
        if(file){setNewProduct({ ...newProducts, image: file });
    }
        }}
      />
      <button onClick={handleAddProduct} style={{backgroundColor:"lightseagreen",fontSize:"14px", padding:" 12px 16px",fontWeight:" 600", borderRadius:" 10px",border:" none",cursor:" pointer",color:" #fff" }}>Add Product</button>
      
      </div>
      <div style={{backgroundColor:"white", padding:"8px", marginTop:"10px", borderRadius:"14px"}}>
      <h2>All Products</h2>
      
      <ul>
        {product.map((p) => (
          <li key={p.id}>
            <img 
        src={p.image} 
        alt={p.title} 
        width={80} 
        height={80} 
        style={{ objectFit: "contain" }} 
      />
            {p.title} - ${p.price}
          </li>
        ))}
      </ul>

   </div>
    </div>
  );
}
