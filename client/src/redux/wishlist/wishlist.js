import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 products: [],
};

const wishlistSlice = createSlice({
 name: "wishlist",
 initialState,
 reducers: {
  addToWishlist: (state, action) => {
   let newProducts;
   if (state.products) {
    newProducts = [...state.products, action.payload];
   } else {
    newProducts = [action.payload];
   }
   state.products = newProducts;
  },
  removeFromWishlist: (state, action) => {
   let newProducts = state.products.filter(
    (product) => product.id !== action.payload
   );
   state.products = newProducts;
  },
 },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
