import { Card, CardContent } from "@/components/ui/card";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlist/wishlist";
import React from "react";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
const Wishlist = () => {
 const dispatch = useDispatch();
 const { products: wishlist } = useSelector((state) => state.wishlist);

 return (
  <>
   {wishlist ? (
    <div className="my-12 flex gap-4 flex-wrap ">
     {wishlist.map((product) => (
      <Card
       key={product.id}
       className="w-[316px] h-[475px] group cursor-pointer rounded-sm"
      >
       <CardContent className="p-0 ">
        <div className="overflow-hidden relative ">
         <img
          onClick={() => {
           nav(`/product/${product.id}`);
          }}
          src={`/img/product/${product.images[0]?.url}`}
          alt={"product.name"}
          className=" group-hover:scale-105 transition-all duration-300 w-[316px] h-[475px]"
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
