import { Button } from "@/components/ui/button";
import { formater } from "@/lib/formater";
import axios from "axios";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlist/wishlist";

const Cart = () => {
 const nav = useNavigate();
 const dispatch = useDispatch();
 const { products: wishlist } = useSelector((state) => state.wishlist);

 const [order, setOrder] = useState(null);
 const [items, setItems] = useState(null);
 let [totalPrice, setTotalPrice] = useState(0);
 let [totalItems, setTotalItems] = useState(0);
 let [shippingFee, setShippingFee] = useState(0);

 const getOrder = async () => {
  const res = await axios.get("/api/v1/orders/me");
  if (res.data.status === "success") {
   setOrder(res.data.order);
   setItems(res.data.order.orderItems);
  }
 };

 const handelCheckout = async () => {
  const stripe = await loadStripe(
   "pk_test_51ONhCnDQFtpqFCDZnMTeC6FTUMaIJsDNFUUU4y2Xs6HQYGl5jXZ9jLMEnirrZHf2udC64xk8Wnc4MqofXn6QmI6d00vrHfaWe8"
  );
  const res = await axios.get(`/api/v1/orders/checkout-session/${order.id}`);
  stripe.redirectToCheckout({
   sessionId: res.data.session.id,
  });
 };
 const handelRemoveFromCart = async (itemId) => {
  const res = await axios.delete(`/api/v1/orders/${order.id}/${itemId}`);
  if (res.status === 204) {
   setItems(items.filter((item) => item.id !== itemId));
  }
 };
 const handelAddToWishlist = async () => {};
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
  getOrder();
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
   {items ? (
    <div className="grid grid-cols-6 gap-12 my-12 relative">
     <div className="col-span-4 flex flex-col gap-4">
      {items.map((item) => (
       <div
        className="flex gap-4 shadow-md hover:shadow-lg duration-300"
        key={item.id}
       >
        <img
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
         </div>
        </div>
       </div>
      ))}
     </div>
     <div className="col-span-2 border py-12 px-8 flex flex-col gap-6 h-fit sticky top-3">
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
      <Button onClick={handelCheckout}>CHECKOUT</Button>
     </div>
    </div>
   ) : (
    <h1>No orders yet, create one now by purchasing products</h1>
   )}
  </>
 );
};

export default Cart;
