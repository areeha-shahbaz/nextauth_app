"use client";
import React, { useState, useEffect } from "react";

type Product = {
  _id?: string;
  id?: number;
  title: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
};

export default function ProductTab() {
  const [loading, setLoading] = useState(true);
  const [product, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProduct] = useState<{
    title: string;
    price: string;
    category: string;
    description: string;
    image: string | File;
  }>({ title: "", price: "", category: "", description: "", image: "" });

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
    const { title, price, image, category, description } = newProducts;
    if (!title || !price || !image || !category || !description) return alert("Please fill all fields!");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price.toString());
      formData.append("category", category);
      formData.append("description", description);
      formData.append("image", image as File);

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      const added = await res.json();
      setProducts([added, ...product]);
      setNewProduct({ title: "", price: "", category: "", description: "", image: "" });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>Loading products...</h2>;

  return (
    <div style={{ minHeight: "100vh", padding: "0px", margin: "0px" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "15px",
          marginTop: "5px",
          marginBottom: "15px",
          borderRadius: "14px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <h2 style={{ padding: "8px" }}>Add New Product</h2>

        <input
          style={{ fontSize: "12px", margin: "5px", padding: "5px" }}
          type="text"
          placeholder="Title"
          value={newProducts.title}
          onChange={(e) => setNewProduct({ ...newProducts, title: e.target.value })}
        />

        <input
          style={{ fontSize: "12px", margin: "5px", padding: "5px" }}
          type="text"
          placeholder="Price"
          value={newProducts.price}
          onChange={(e) => setNewProduct({ ...newProducts, price: e.target.value })}
        />

        <input
          style={{ fontSize: "12px", margin: "5px", padding: "5px" }}
          type="text"
          placeholder="Category"
          value={newProducts.category}
          onChange={(e) => setNewProduct({ ...newProducts, category: e.target.value })}
        />

        <textarea
          style={{ fontSize: "12px", margin: "5px", padding: "5px", width: "95%" }}
          placeholder="Description"
          value={newProducts.description}
          onChange={(e) => setNewProduct({ ...newProducts, description: e.target.value })}
        />

        <input
          style={{ fontSize: "12px", margin: "5px", padding: "5px" }}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setNewProduct({ ...newProducts, image: file });
          }}
        />

        <button
          onClick={handleAddProduct}
          style={{
            backgroundColor: "lightseagreen",
            fontSize: "14px",
            padding: "10px 12px",
            margin: "4px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          Add Product
        </button>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "15px",
          marginTop: "10px",
          borderRadius: "14px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <h2>All Products</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {product.map((p) => (
            <li key={p.id} style={{ marginBottom: "10px" }}>
              <img src={p.image} alt={p.title} width={80} height={80} style={{ objectFit: "contain" }} />
              <div>
                <strong>{p.title}</strong> - ${p.price}
                <br />
                <small>Category: {p.category}</small>
                <br />
                <small>{p.description}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
