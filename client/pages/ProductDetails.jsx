import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";

const ProductDetails = () => {
 const params = useParams();
 const { productId } = params;
 const [product, setProduct] = useState(null);

 //  console.log(product);
 const fetchProduct = async () => {
  try {
   const res = await axios.get(`/api/v1/products/${productId}`);
   if (res.status === 200) {
    setProduct(res.data.product);
   }
  } catch (error) {}
 };
 useEffect(() => {
  fetchProduct();
 }, []);
 return (
  <>
   {product && (
    <div className="bg-black my-12">
     <div className="flex justify-center items-center gap-12">
      <div className="flex-1">
       <Card
        className="w-[558px] h-[837px] group cursor-pointer rounded-sm"
        onClick={() => {
         nav(`/product/${product.id}`);
        }}
       >
        <CardContent className="p-0 ">
         <div className="overflow-hidden relative ">
          <img
           src={`/img/product/${product.images[0]?.url}`}
           alt={"product.name"}
           className=" group-hover:scale-105 transition-all duration-300 w-full h-full"
          />
         </div>
        </CardContent>
       </Card>
      </div>
      <div className="flex-1"></div>
     </div>
    </div>
   )}
  </>
 );
};

export default ProductDetails;
