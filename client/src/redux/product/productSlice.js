import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 categories: null,
 products: null,
};

const productSlice = createSlice({
 name: "product",
 initialState,
 reducers: {
  loadData: (state, action) => {
   state.categories = action.payload;
  },
  setProducts: (state, action) => {
   state.products = action.payload;
  },
 },
});

export const { loadData, setProducts } = productSlice.actions;
export default productSlice.reducer;
