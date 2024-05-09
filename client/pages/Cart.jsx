import { Button } from "@/components/ui/button";
import { formater } from "@/lib/formater";
import axios from "axios";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlist/wishlist";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Cart = () => {
 const dispatch = useDispatch();
 const { products: wishlist } = useSelector((state) => state.wishlist);

 const [order, setOrder] = useState(null);
 const [items, setItems] = useState(null);

 const [paiedOrders, setPaiedOrders] = useState(null);

 let [totalPrice, setTotalPrice] = useState(0);
 let [totalItems, setTotalItems] = useState(0);
 let [shippingFee, setShippingFee] = useState(0);
 const [loading, setLoading] = useState(false);
 const [fetching, setFetching] = useState(false);

 const getOrders = async () => {
  try {
   setFetching(true);
   const res = await axios.get("/api/v1/orders/me");
   if (res.data.status === "success") {
    setOrder(res.data.currentOrder);
    setItems(res.data.currentOrder?.orderItems);
    setPaiedOrders(res.data.paiedOrders);
   }
  } catch (error) {
   console.log(error);
  } finally {
   setFetching(false);
  }
 };

 const handelCheckout = async () => {
  setLoading(true);
  const stripe = await loadStripe(
   "pk_test_51NZQSlFLivuJ6OmBvRNB2e5NGOV4zcDH67Cf3jorbmNFBW7SjRjHi03pbNdnQ9AO6qIhyis5mnslc56Fsce6bq4G002veZtrCA"
  );
  try {
   const res = await axios.get(`/api/v1/orders/checkout-session/${order.id}`);
   stripe.redirectToCheckout({
    sessionId: res.data.session.id,
   });
  } catch (error) {
   toast.error(error);
  } finally {
   setLoading(false);
  }
 };
 const handelRemoveFromCart = async (itemId) => {
  const res = await axios.delete(`/api/v1/orders/${order.id}/${itemId}`);
  if (res.status === 204) {
   setItems(items.filter((item) => item.id !== itemId));
  }
 };
 const handelUpdateQuantity = async (type, itemId, amount) => {
  if (type === "-") {
   const res = await axios.patch(`/api/v1/orders/${order.id}/${itemId}`, {
    amount: parseInt(amount) - 1,
   });
   if (res.data.status === "success") {
    setItems((prevItems) =>
     prevItems.map((item) => {
      if (item.id === itemId) {
       return { ...item, amount: parseInt(item.amount) - 1 };
      }
      return item;
     })
    );
   }
  } else {
   const res = await axios.patch(`/api/v1/orders/${order.id}/${itemId}`, {
    amount: parseInt(amount) + 1,
   });
   if (res.data.status === "success") {
    setItems((prevItems) =>
     prevItems.map((item) => {
      if (item.id === itemId) {
       return { ...item, amount: parseInt(item.amount) + 1 };
      }
      return item;
     })
    );
   }
  }
 };

 useEffect(() => {
  getOrders();
 }, []);
 useEffect(() => {
  totalPrice = 0;
  totalItems = 0;
  items?.forEach((item) => {
   const price = parseFloat(item.product.price);
   const amount = parseInt(item.amount);
   totalPrice += price * amount;
   totalItems += amount;
   setTotalPrice(totalPrice);
   setTotalItems(totalItems);
  });
  totalPrice > 500 ? setShippingFee(0) : setShippingFee(50);
 }, [items]);

 return (
  <>
   {items?.length > 0 && (
    <div className="text-xs md:text-base grid grid-cols-1 md:grid-cols-6 gap-12 my-12 relative">
     <div className="col-span-4 flex flex-col gap-4">
      {items.map((item) => (
       <div
        className="flex gap-4 shadow-md hover:shadow-lg duration-300"
        key={item.id}
       >
        <img
         loading="lazy"
         src={`/img/product/${item.product.images[0].url}`}
         alt={item.product.name}
         className="w-52 h-48 object-cover
         "
        />
        <div className="p-4 flex flex-col justify-between w-full">
         <div className="flex justify-between">
          <div>
           <h2 className="font-semibold">{item.product.name}</h2>
           <p>{item.product.description}</p>
          </div>
          <span className="font-bold">{formater(item.product.price)}</span>
         </div>
         <div className="flex">
          <Button
           size="icon"
           variant="ghost"
           onClick={() => handelRemoveFromCart(item.id)}
          >
           <Trash2 />
          </Button>
          <Button
           size="icon"
           variant="ghost"
           onClick={() =>
            wishlist?.find((p) => p.id === item.product.id)
             ? dispatch(removeFromWishlist(item.product.id))
             : dispatch(addToWishlist(item.product))
           }
          >
           <Heart
            style={
             wishlist?.find((p) => p.id === item.product.id)
              ? { fill: "red", color: "red" }
              : {}
            }
           />
          </Button>
          <div className="flex-1 text-end flex justify-end items-center">
           <Button
            onClick={() => handelUpdateQuantity("-", item.id, item.amount)}
            className="w-8 h-8  shadow-sm border border-gray-100"
            size="icon"
            variant="ghost"
            disabled={+item.amount === 1}
           >
            <Minus />
           </Button>
           <Label className="px-2 text-lg">{item.amount}</Label>
           <Button
            onClick={() => handelUpdateQuantity("+", item.id, item.amount)}
            className="w-8 h-8  shadow-sm border border-gray-100"
            size="icon"
            variant="ghost"
           >
            <Plus />
           </Button>
          </div>
         </div>
        </div>
       </div>
      ))}
     </div>
     <div className="text-xs col-span-4 md:col-span-2 border py-12 px-8 flex flex-col gap-6 h-fit sticky top-3">
      <h2 className="font-semibold text-xl">Order Summary</h2>
      <div className="text-gray-600 flex justify-between items-center">
       <p>
        Subtotal ({totalItems}) {totalItems <= 1 ? "item" : "items"}
       </p>
       <p>{formater(totalPrice)}</p>
      </div>
      <div className="text-gray-600 flex justify-between items-center">
       <p>Shipping Fee</p>
       <p>
        {shippingFee ? (
         formater(shippingFee)
        ) : (
         <span className="font-bold text-green-500">Free</span>
        )}
       </p>
      </div>
      <hr />
      <div className="font-bold text-xl flex justify-between items-center">
       <p>Total</p>
       <p>{formater(totalPrice + shippingFee)}</p>
      </div>
      <Button onClick={handelCheckout} disabled={loading}>
       CHECKOUT
      </Button>
     </div>
    </div>
   )}
   {paiedOrders?.length > 0 && (
    <>
     <Separator />
     <Label className="text-xl font-semibold block mt-4">
      Your Paied Orders
     </Label>
     <div className="my-12 flex flex-col gap-4 text-xs md:text-base">
      {paiedOrders?.map((order) => (
       <div className="" key={order.id}>
        <div className="flex flex-col md:flex-row gap-4 divide-y-[1px] md:divide-y-0  shadow-md hover:shadow-lg duration-300">
         <div className=" grid grid-cols-4 gap-2">
          {order?.orderItems?.map((i) => (
           <img
            key={i.id}
            loading="lazy"
            // src={`/img/product/${i.product.images[0].url}`}
            src={`https://e-commerce-dev.onrender.com/img/product/product-cover-1715264955369.jpeg`}
            alt={i.product.name}
            className="w-32  object-cover"
           />
          ))}
         </div>
         <div className="ml-auto p-4 text-xs md:text-base">
          <div className="flex justify-end gap-20 ">
           <div className="flex flex-col gap-1">
            {order?.orderItems?.map((i) => (
             <div className="flex" key={i.id}>
              <h2 className="font-semibold max-w-64 line-clamp-1 ">
               {i.product.name} :
              </h2>
              <span>{i.size}</span>
              <span className="ml-1">({i.amount})</span>
             </div>
            ))}
           </div>
           <div className="font-semibold flex flex-col gap-2 w-full">
            <h3>
             Items :{" "}
             {order.orderItems.reduce((acc, item) => {
              return (acc += +item.amount);
             }, 0)}
            </h3>
            <h3>
             Total :{" "}
             {formater(
              order.orderItems.reduce((acc, item) => {
               return (acc += +item.amount * +item.product.price);
              }, 0)
             ).toString()}
            </h3>
            <h3>Date : {new Date(order.createdAt).toLocaleDateString()}</h3>
            <h3>
             Status :{" "}
             <span
              className="px-2 py-1 rounded-sm "
              style={
               order.status === "Recived"
                ? { background: "lightGreen" }
                : { background: "orange" }
              }
             >
              {order.status}
             </span>
            </h3>
           </div>
          </div>
          {/* <div className="flex">
           <Button
            size="icon"
            variant="ghost"
            onClick={() => handelRemoveFromCart(order.orderItems[0].id)}
           >
            <Trash2 />
           </Button>
           <Button
            size="icon"
            variant="ghost"
            onClick={() =>
             wishlist?.find((p) => p.id === product.id)
              ? dispatch(removeFromWishlist(product.id))
              : dispatch(addToWishlist(product))
            }
           >
            <Heart
             // className="w-10 h-10"
             style={
              wishlist?.find((p) => p.id === item.product.id)
               ? { fill: "red", color: "red" }
               : {}
             }
            />
           </Button>
           <div className="flex-1 text-end flex justify-end items-center">
            <Button
             onClick={() => handelUpdateQuantity("-", item.id, item.amount)}
             className="w-8 h-8  shadow-sm border border-gray-100"
             size="icon"
             variant="ghost"
             disabled={+item.amount === 1}
            >
             <Minus />
            </Button>
            <Label className="px-2 text-lg">{item.amount}</Label>
            <Button
             onClick={() => handelUpdateQuantity("+", item.id, item.amount)}
             className="w-8 h-8  shadow-sm border border-gray-100"
             size="icon"
             variant="ghost"
            >
             <Plus />
            </Button>
           </div>
          </div> */}
         </div>
        </div>
       </div>
      ))}
     </div>
    </>
   )}
   {fetching ? (
    <div className="md:grid grid-cols-5 gap-6 md:my-12">
     <div className="md:col-span-3  my-6 md:my-0 space-y-4  ">
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-full aspect-[5/5] md:hidden" />
     </div>
     <Skeleton className="md:col-span-2  hidden md:block" />
    </div>
   ) : (
    !items &&
    !paiedOrders && (
     <h1>No orders yet, create one now by purchasing products</h1>
    )
   )}
  </>
 );
};

export default Cart;
