import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loadData } from "@/redux/product/productSlice";
// import test from "/img/product/product-cover-1712366464909.jpeg";
const Home = () => {
 const dispatch = useDispatch();
 //  const { categories: data } = useSelector((state) => state.product);

 // const products = data[0]?.products;

 //  console.log(data[0].billboard.imageUrl)
 const [categories, setCategories] = useState([]);
 const [data, setData] = useState([]);
 const [products, setProducts] = useState([]);

 const fetchCategories = async () => {
  try {
   const res = await axios.get("/api/v1/categories");
   setCategories(res.data.categories);
   const firstCat = res.data.categories.reverse()[0].name;
   dispatch(loadData(res.data.categories.slice(1,2)));
   const products = await axios.get(`/api/v1/categories/${firstCat}`);
  //  console.log(products.data);
   setData([products.data.category]);
   setProducts(products.data.category.products);
  } catch (error) {
   console.error("Error fetching products:", error);
  }
 };
// console.log(data)

 useEffect(() => {
  fetchCategories();
  // fetchCategory();
 }, []);
 return (
  <>
   {data.length >0 && (
    <div className="relative">
     <img
      src={`/img/billboard/${data[0].billboard.imageUrl}`}
      alt="billboard"
      className="w-full mt-4 mb-12"
     />
     <h1 className="absolute bottom-[45%] text-center w-full  text-5xl">
      {data[0].billboard.label}
     </h1>
    </div>
   )}
   {products.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12">
     {products.map((product, index) => (
      <Card key={product.id} className="w-full group cursor-pointer">
       <CardContent>
        <div className="overflow-hidden relative">
         <img
          src={`/img/product/${product.images[0]?.url}`}
          alt={"product.name"}
          className=" group-hover:scale-110 transition-all duration-300 "
         />
         <div className="absolute bottom-2 w-full flex items-center justify-center gap-6  group-hover:opacity-100 opacity-0 transition-all duration-300">
          <Expand className="h-8 w-8 hover:scale-[1.08] duration-300 transition-all" />
          <ShoppingCart className="h-8 w-8 hover:scale-[1.08] duration-300 transition-all" />
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
