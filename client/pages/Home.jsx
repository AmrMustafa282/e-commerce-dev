import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  
  const loadImage = (imageName) => import(`./${imageName}`).default;

 //  console.log(products[8].images[0].url);

 return (
  <>
   {products.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
     {products.map((product) => (
      <Card key={product.id} className="w-full">
       <CardContent>
        <div>
         <img
          src={loadImage(`/img/product/${product.images[0]?.url}`)}
          alt=""
         />
         {/* <img src={cover} alt="" /> */}
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
