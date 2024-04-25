import React from "react";

export const formater = (price) => {
 // Formatting the price
 const formattedPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EGY",
  minimumFractionDigits: 0,
  // maximumFractionDigits: 2,
 }).format(price);

 return formattedPrice;
};
