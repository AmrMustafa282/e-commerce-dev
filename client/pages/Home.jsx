import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Expand , ShoppingCart } from "lucide-react";

// import test from "/img/product/product-cover-1712366464909.jpeg";
const Home = () => {
 //  const auth = useAuthUser();
 const [products, setProducts] = useState([]);

 const fetchProducts = async () => {
  try {
   const res = await axios.get("/api/v1/products");
   setProducts(res.data.products);
  } catch (error) {
   console.error("Error fetching products:", error);
  }
 };

 useEffect(() => {
  fetchProducts();
 }, []);

 return (
  <>
   {products.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
     {products.map((product, index) => (
      <Card key={product.id} className="w-full">
       <CardContent>
        <div className="overflow-hidden relative">
         <img
          src={`/img/product/${product.images[0]?.url}`}
          alt={"product.name"}
          className="hover:scale-110 transition-all duration-300 "
         />
         <div className="absolute bottom-3 w-full items-center justify-center flex gap-6  ">
          <Expand className="h-10 w-10 hover:scale-[1.08] duration-300 transition-all"/>
          <ShoppingCart className="h-10 w-10 hover:scale-[1.08] duration-300 transition-all"/>
         </div>
        </div>
       </CardContent>
       <CardFooter className="flex flex-col items-start">
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p>{product.category.name}</p>
        <h3 className="my-3 text-2xl">${product.price}</h3>
       </CardFooter>
      </Card>
     ))}
    </div>
   ) : (
    <h1>Loading</h1>
   )}
  </>
 );
};

export default Home;
