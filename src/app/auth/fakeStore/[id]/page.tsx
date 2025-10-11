"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "src/app/context/CartContext";
import { Product, CartItem } from "src/types/products";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 20));
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = () => {
    const item: CartItem = { ...product!, quantity };
    addToCart(item);
    setAdded(true);
  };

  const handleBuyNow = () => {
    const item: CartItem = { ...product!, quantity };
    addToCart(item);
    router.push("/auth/cart");
  };

  const Skeleton = ({
    width,
    height,
    radius = "8px",
  }: {
    width: string;
    height: string;
    radius?: string;
  }) => (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }}
    />
  );

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          padding: "30px 20px",
          background: "#f9fafb",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "50px",
            maxWidth: "1100px",
            width: "100%",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            padding: "40px",
          }}
        >
          {/* Image Section */}
          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton width="100%" height="420px" radius="12px" />
          </div>

          {/* Text & Details Section */}
          <div
            style={{
              flex: "1.2",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Skeleton width="70%" height="36px" radius="8px" />
            <div style={{ height: "10px" }} />

            <Skeleton width="40%" height="20px" radius="6px" />
            <div style={{ height: "20px" }} />

            <Skeleton width="100%" height="90px" radius="10px" />
            <div style={{ height: "25px" }} />

            <Skeleton width="25%" height="35px" radius="6px" />
            <div style={{ height: "25px" }} />

            {/* Quantity buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "25px",
              }}
            >
              <Skeleton width="70px" height="40px" radius="8px" />
              <Skeleton width="70px" height="40px" radius="8px" />
              <Skeleton width="70px" height="40px" radius="8px" />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <Skeleton width="150px" height="50px" radius="10px" />
              <Skeleton width="150px" height="50px" radius="10px" />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );

  if (!product)
    return (
      <p style={{ padding: "20px", textAlign: "center" }}>
        Product not found
      </p>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "50px",
          maxWidth: "1100px",
          width: "100%",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          padding: "40px",
        }}
      >
        {/* Image Section */}
        <div
          style={{
            flex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              height: "420px",
              borderRadius: "12px",
              objectFit: "contain",
              padding: "20px",
            }}
          />
        </div>

        {/* Details Section */}
        <div style={{ flex: "1.2", display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "600",
              marginBottom: "10px",
              color: "#222",
            }}
          >
            {product.title}
          </h1>

          <p
            style={{
              color: "#363636",
              fontSize: "0.95rem",
              marginBottom: "8px",
            }}
          >
            Category: <span style={{ color: "teal" }}>{product.category}</span>
          </p>

          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: "#555",
              marginBottom: "25px",
              whiteSpace: "pre-line",
            }}
          >
            {product.description}
          </p>

          <h2
            style={{
              fontSize: "1.8rem",
              color: "teal",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
          >
            ${product.price}
          </h2>

          {/* Quantity */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "25px",
            }}
          >
            <span style={{ fontWeight: "500" }}>Quantity:</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={decreaseQty}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  background: "#f3f3f3",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                -
              </button>
              <span
                style={{
                  padding: "6px 16px",
                  fontSize: "1rem",
                  background: "#fff",
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={increaseQty}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  background: "#f3f3f3",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={handleBuyNow}
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                borderRadius: "10px",
                background: "orange",
                color: "#fff",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "background 0.3s ease",
                boxShadow: "0 4px 10px rgba(255, 165, 0, 0.4)",
              }}
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              disabled={added}
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                background: added ? "gray" : "teal",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: added ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: added
                  ? "none"
                  : "0 4px 10px rgba(0, 128, 128, 0.3)",
              }}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
