import { Routes, Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Layout from "./components/Layout";
import Cart from "../pages/Cart";

function App() {
 return (
  <>
   <Layout>
    <Routes>
     <Route path="/login" element={<Login />} />
     <Route path="/sign-up" element={<SignUp />} />
      <Route path="/" element={<Home />} />
     <Route element={<AuthOutlet fallbackPath="/login" />}>
      <Route path="/cart" element={<Cart/>} />
     </Route>
    </Routes>
   </Layout>
  </>
 );
}

export default App;
