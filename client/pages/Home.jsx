import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { loadData } from "@/redux/product/productSlice";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";
const Home = () => {
 const nav = useNavigate();
 const dispatch = useDispatch();
 const [billboard, setBillboard] = useState(null);
 const [products, setProducts] = useState([]);

 const fetchCategories = async () => {
  try {
   const res = await axios.get("/api/v1/categories");
   dispatch(loadData(res.data.categories));
   const billboard = await axios.get("/api/v1/billboards/featured");
   const products = await axios.get(`/api/v1/products/featured`);
   setBillboard(billboard.data.billboard);
   setProducts(products.data.products);
  } catch (error) {
   console.error("Error fetching products:", error);
  }
 };

 useEffect(() => {
  fetchCategories();
 }, []);
 return (
  <>
   {billboard && (
    <div className="relative">
     <img
      src={`/img/billboard/${billboard.imageUrl}`}
      alt="billboard"
      className="w-full mt-4 mb-12"
     />
     <h1 className="absolute bottom-[45%] text-center w-full  text-5xl">
      {billboard.label}
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

export default Home;
