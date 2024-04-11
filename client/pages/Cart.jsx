import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Cart = () => {
 const { currentUser } = useSelector((state) => state.user);
 const { orders } = currentUser.data.user || [];

 const getOrders = async () => {
  const ordersFromApi = await axios.get(`/api/v1/orders/me/${orders[0].id}`);
  console.log(ordersFromApi);
 };
 useEffect(() => {
  getOrders();
 }, []);

 //  console.log(currentUser.data.user);
 return (
  <>
   {orders.length > 0 ? (
    <div>{orders.map((order) => order.id)}</div>
   ) : (
    <h1>No orders yet, create one now by purchasing products</h1>
   )}
  </>
 );
};

export default Cart;
