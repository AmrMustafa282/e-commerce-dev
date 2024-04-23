import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Category = () => {
 const [data, setData] = useState([]);
 const [products, setProducts] = useState([]);
 const params = useParams();
 const nav = useNavigate();
 const fetchCategory = async () => {
  try {
   const products = await axios.get(
    `/api/v1/categories/${params.categoryName}`
   );
   setData([products.data.category]);
   setProducts(products.data.category.products);
   // console.log(products.data.category);
  } catch (error) {
   console.error("Error fetching products:", error);
  }
 };

 useEffect(() => {
  fetchCategory();
 }, [params.categoryName]);

 return (
  <>
   {data.length > 0 && (
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
    <div className="flex gap-4 flex-wrap mb-12 ">
     {products.map((product, index) => (
      <Card
       key={product.id}
       className="w-[316px] h-[475px] group cursor-pointer rounded-sm"
       onClick={() => {
        nav(`/product/${product.id}`);
       }}
      >
       <CardContent className="p-0 ">
        <div className="overflow-hidden relative ">
         <img
          src={`/img/product/${product.images[0]?.url}`}
          alt={"product.name"}
          className=" group-hover:scale-105 transition-all duration-300 w-[316px] h-[475px]"
         />
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   ) : (
    <h1>Loading</h1>
   )}
  </>
 );
};

export default Category;
