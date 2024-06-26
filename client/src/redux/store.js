import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import productReducer from "./product/productSlice.js";
import wishlistReducer from "./wishlist/wishlist.js";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import wishlist from "./wishlist/wishlist.js";

const rootReducer = combineReducers({
 user: userReducer,
 product: productReducer,
 wishlist: wishlistReducer,
});

const persistConfig = {
 key: "root",
 storage,
 version: 1,
 whitelist: ["user", "wishlist"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
 reducer: persistedReducer,
 middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
