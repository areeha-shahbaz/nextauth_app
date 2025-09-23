"use client";
import {useState, useEffect} from "react";
import Header from "../../components/header";  
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./store.module.css";
type Product = {
    id:number,
    image:string,
    title:string,
    price:number,
}
const ProductPage =()=>{
    const[product,setProduct] =  useState<Product[]>([]);
    const [visibleProducts, setVisibleProducts]= useState<Product[]>([]);
    const [itemsPerPage]=useState(10);
    const [loading, setLoading]=useState(true);
 const fetchMoreData = () => {
    if(visibleProducts.length >= product.length){
     setVisibleProducts(prev=>[...prev,...product]);
    }
    else{
        const next = visibleProducts.length+itemsPerPage;
        setVisibleProducts(product.slice(0,next));
    }


  };
useEffect(()=>{
  const loadingProducts= async () =>{
   try{
        setLoading(true);
  const res= await fetch("https://fakestoreapi.com/products")
const data:Product[]= await res.json();
  setProduct(data);
    setVisibleProducts(data.slice(0,itemsPerPage));

   }
   catch(err) {console.error(err);

   }
finally{
    setLoading(false);

}
  };
loadingProducts();
  }, [itemsPerPage]);


return (
    <div className={styles.divbody}>
    <div className={styles.pagecontainer}>
        <Header/>
        { loading ? ( <div className={styles.grid}>
            {Array.from ({length: itemsPerPage}).map((_,i)=>(
                <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonPrice}></div>
                    </div>
            ))}
          </div>
        ):(     <InfiniteScroll
  dataLength={visibleProducts.length}
  next={fetchMoreData}
//   hasMore={true}
  hasMore={visibleProducts.length < product.length}
loader={
  <div className={styles.loader}>
    <div className={styles.spinner}></div>
  </div>
}

>
  <div className={styles.grid}>
    {visibleProducts.map((p) => (
      <div key={p.id} className={styles.productCard}>
  <div className={styles.productImage}>
    <img src={p.image} alt={p.title} loading="lazy" />
  </div>
  <div className={styles.productInfo}>
    <h3>{p.title}</h3>
    <p>${p.price}</p>
    <div className={styles.productActions}>
      <button className={styles["add-to-cart"]}>Add to Cart</button>
    </div>
  </div>
</div>
    ))}
  </div>
</InfiniteScroll>)}
   
</div>
    </div>
);
};

export default ProductPage;
