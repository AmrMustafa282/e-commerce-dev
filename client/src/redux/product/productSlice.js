import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 categories: null,
};

const productSlice = createSlice({
 name: "product",
 initialState,
 reducers: {
  loadData: (state, action) => {
   state.categories = action.payload;
  },
 },
});

export const { loadData } = productSlice.actions;
export default productSlice.reducer;
