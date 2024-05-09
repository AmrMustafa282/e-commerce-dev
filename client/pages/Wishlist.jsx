import { Card, CardContent } from "@/components/ui/card";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlist/wishlist";
import React from "react";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Wishlist = () => {
 const dispatch = useDispatch();
 const nav = useNavigate();
 const { products: wishlist } = useSelector((state) => state.wishlist);

 return (
  <>
   {wishlist ? (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 mt-4">
     {wishlist.map((product) => (
      <Card
       key={product.id}
       className=" group cursor-pointer rounded-sm"
      >
       <CardContent className="p-0 ">
        <div className="overflow-hidden relative ">
         <img
          loading="lazy"
          onClick={() => {
           nav(`/product/${product.id}`);
          }}
          src={`/img/product/${product.images[0]?.url}`}
          alt={"product.name"}
          className=" group-hover:scale-105 transition-all duration-300 w-full"
         />
         <button
          onClick={() =>
           wishlist?.find((p) => p.id === product.id)
            ? dispatch(removeFromWishlist(product.id))
            : dispatch(addToWishlist(product))
          }
          className="absolute bottom-2 right-[45%] opacity-0 group-hover:opacity-100 group-hover:bottom-6 hover:scale-105 duration-300"
         >
          <Heart
           className="w-8 h-8"
           style={
            wishlist?.find((p) => p.id === product.id)
             ? { fill: "red", color: "red" }
             : {}
           }
          />
         </button>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   ) : (
    <h2>You have no products in your wishlist, you can add now.</h2>
   )}
  </>
 );
};

export default Wishlist;
