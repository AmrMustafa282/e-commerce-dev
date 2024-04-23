import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
 Carousel,
 CarouselContent,
 CarouselItem,
 CarouselScrollTo,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
// import Autoplay from "embla-carousel-autoplay";

// import { useCarousel } from "./../src/components/ui/carousel";

const ProductDetails = () => {
 const params = useParams();
 //  const { scrollTo } = useCarousel;
 const { productId } = params;
 const [product, setProduct] = useState(null);
 const [index, setIndex] = useState(0);

 const fetchProduct = async (id = productId) => {
  try {
   const res = await axios.get(`/api/v1/products/${id}`);
   if (res.status === 200) {
    setProduct(res.data.product);
   }
  } catch (error) {
   console.error("Error fetching product:", error);
  }
 };

 useEffect(() => {
  fetchProduct();
 }, []);


 return (
  <>
   {product && (
    <div className=" my-12">
     <div className="flex flex-col items-center gap-4 md:flex-row justify-center ">
      <div className="flex-1 ">
       <Carousel
        className=" w-[558px] h-[837px] overflow-hidden"
        opts={{
         align: "start",
         loop: true,
         dragFree: true,
        }}
       >
        <CarouselContent className="">
         {product.images.slice(1).map((image, index) => (
          <CarouselItem className="" key={index}>
           <div className="p-1">
            <Card className="w-[558px] h-[837px] group cursor-pointer">
             <CardContent className="p-0">
              <div className="overflow-hidden relative">
               <img
                src={`/img/product/${image.url}`}
                alt={product.name}
                className="w-full h-full"
               />
              </div>
             </CardContent>
            </Card>
           </div>
          </CarouselItem>
         ))}
        </CarouselContent>
        <CarouselScrollTo index={index} />
       </Carousel>
      </div>
      <div className="flex-1  mt-0 flex flex-col justify-evenly">
       <div>
        <h1 className="font-bold text-4xl mb-8">{product.name}</h1>
        <span className="w-20 h-2 bg-black block" />
        <h2 className="font-semibold text-3xl my-8">£{product.price}</h2>
        <p className="text-lg text-gray-500 mb-6">
          {product.description}
               </p>
        <p className="text-lg text-gray-500 mb-2">
         CHECK IN-STORE AVAILABILITY
        </p>
        <p className="text-lg text-gray-500 ">
         SHIPPING, EXCHANGES AND RETURNS
        </p>
        <hr className="my-8" />
        <span className="text-2xl font-semibold ">
         Size : <span className="font-normal">{product.size.name}</span>
        </span>
        <div className="flex gap-4">
         <>
          <div className="w-fit px-6 py-4 mt-4 mb-8 bg-black text-white font-extrabold text-2xl">
           {product.size.value}
          </div>
         </>
        </div>

        <span className="text-2xl font-semibold ">
         Color : <span className="font-normal">{product.color.name}</span>
        </span>
        <div className="flex gap-4">
         {product.relatedProducts.products?.map((product) => (
          <>
           <Button
            style={{ backgroundColor: `${product.color.value}` }}
            className="cursor-pointer hover:scale-105 duration-300 transition-all w-fit px-6 py-8 my-4  text-white font-extrabold text-2xl"
            onClick={() => fetchProduct(product.id)}
           ></Button>
          </>
         ))}
        </div>
       </div>
       <Button className="w-full ">ADD TO CART</Button>
      </div>
     </div>
     <div className="flex mt-4">
      {product.images.slice(1).map((image, i) => (
       <img
        key={i}
        src={`/img/product/${image.url}`}
        alt={product.name}
        className="w-[105px] h-[158px] cursor-pointer mx-2 border border-gray-300"
        onClick={() => setIndex(i)}
        style={i === index ? { border: "solid 2px black" } : {}}
       />
      ))}
     </div>
    </div>
   )}
  </>
 );
};

export default ProductDetails;
