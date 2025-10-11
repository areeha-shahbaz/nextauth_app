"use client";
import { useState, useEffect } from "react";
import Header from "../../components/header";  
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./store.module.css";
import Link from "next/link";
import { useCart } from "src/app/context/CartContext";
import { Product, CartItem } from "src/types/products";  

const ProductPage = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState<string[]>([]);
const {cart, addToCart}=useCart();

  useEffect(() => {
      setAddedItems(cart.map((item) => item.id));
    }
  , [cart]);

  const fetchMoreData = () => {
    const next = visibleProducts.length + itemsPerPage;
    setVisibleProducts(product.slice(0, next));
  };

 const handleAddToCart = (product: Product) => {
  const item: CartItem = { ...product, quantity: 1 };
  addToCart(item);
};


  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data: Product[] = await res.json();
        setProduct(data);
        setVisibleProducts(data.slice(0, itemsPerPage));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [itemsPerPage]);

  return (
    <div className={styles.divbody}>
      <div className={styles.pagecontainer}>
        <Header />
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonPrice}></div>
              </div>
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={visibleProducts.length}
            next={fetchMoreData}
            hasMore={visibleProducts.length < product.length}
            loader={
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
              </div>
            }
          >
            <div className={styles.grid}>
              {visibleProducts.map((p) => (
                <Link href={`/auth/fakeStore/${p.id}`} key={p.id}>
                <div  className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={p.image} alt={p.title} loading="lazy" />
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{p.title}</h3>
                    <p>${p.price}</p>
                    
      <button className={styles.viewBtn}>View Details</button>
                    {/* <div className={styles.productActions}>
                      <button
                        className={styles["add-to-cart"]}
                        onClick={() => handleAddToCart(p)}
                        disabled={addedItems.includes(p.id)}
                      >
                        {addedItems.includes(p.id) ? "Added" : "Add to Cart"}
                        
                      </button>
                    </div> */}
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
