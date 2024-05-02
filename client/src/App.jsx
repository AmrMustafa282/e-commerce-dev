import { Routes, Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import { Toaster } from "@/components/ui/sonner";

import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Category from "../pages/Category";
import Dashboard from "../pages/Dashboard";
import Layout from "./components/Layout";
import Restrict from "./components/Restrict";
import UpdateBillboard from "../pages/Billboard/Update";
import CreateBillboard from "../pages/Billboard/Create";
import UpdateCategory from "../pages/Categories/Update";
import CreateCategory from "../pages/Categories/Create";
import CreateColor from "../pages/Colors/Create";
import UpdateColor from "../pages/Colors/Update";
import CreateSize from "../pages/Sizes/Create";
import UpdateSize from "../pages/Sizes/Update";
import CreateProduct from "../pages/Products/Create";
import UpdateProduct from "../pages/Products/Update";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";

function App() {
 return (
  <>
   <Layout>
    <Routes>
     <Route path="/login" element={<Login />} />
     <Route path="/sign-up" element={<SignUp />} />
     <Route path="/" element={<Home />} />
     <Route path="/wishlist" element={<Wishlist />} />
     <Route path="/product/:productId" element={<ProductDetails />} />
     <Route path="/:categoryName" element={<Category />} />
     <Route element={<AuthOutlet fallbackPath="/login" />}>
      <Route path="/cart" element={<Cart />} />
      <Route element={<Restrict />}>
       <Route path="/dashboard" element={<Dashboard />} />
       <Route
        path="/dashboard/billboard/create"
        element={<CreateBillboard />}
       />
       <Route
        path="/dashboard/billboard/:billboardId"
        element={<UpdateBillboard />}
       />
       <Route path="/dashboard/category/create" element={<CreateCategory />} />
       <Route
        path="/dashboard/category/:categoryId"
        element={<UpdateCategory />}
       />
       <Route path="/dashboard/color/create" element={<CreateColor />} />
       <Route path="/dashboard/color/:colorId" element={<UpdateColor />} />
       <Route path="/dashboard/size/create" element={<CreateSize />} />
       <Route path="/dashboard/size/:sizeId" element={<UpdateSize />} />
       <Route path="/dashboard/product/create" element={<CreateProduct />} />
       <Route
        path="/dashboard/product/:productId"
        element={<UpdateProduct />}
       />
      </Route>
     </Route>
    </Routes>
   </Layout>
   <Toaster position="top-center" richColors />
  </>
 );
}

export default App;
