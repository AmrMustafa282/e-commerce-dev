import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { ModeToggle } from "./toggleTheme";
// import { NavigationMenuDemo } from "./Navigation";
import { signoutSuccess } from "@/redux/user/userSlice";
import { ShoppingCart, Settings, Heart } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
 const nav = useNavigate();
 const { currentUser } = useSelector((state) => state.user);
 let { categories } = useSelector((state) => state.product);
 // categories = categories.slice(1)
 const [tab, setTab] = useState("overview");
 const location = useLocation();
 const auth = useAuthUser();
 const dispatch = useDispatch();
 const signOut = useSignOut();

 const handelLogout = () => {
  signOut();
  dispatch(signoutSuccess());
  window.location.assign("/");
 };
 const handelLogin = () => {
  window.location.assign("/login");
 };
 useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get("tab")) setTab(urlParams.get("tab"));
 }, [location.search]);

 return (
  <div className="py-2  w-full border-b">
   <div className="container mx-auto h-full flex justify-between items-center">
    <div className="flex gap-6 items-center justify-center">
     <Link to={"/"} className="font-bold text-2xl ">
      STORE
     </Link>
     {/* <NavigationMenuDemo /> */}

     {location.pathname.includes("dashboard") ? (
      <div className="flex gap-3 text-gray-700 ">
       <Link
        className={`${tab === "overview" || undefined ? "text-black" : ""}`}
        to={"/dashboard?tab=overview"}
       >
        Overview
       </Link>
       <Link
        className={`${tab === "billboards" ? "text-black" : ""}`}
        to={"/dashboard?tab=billboards"}
       >
        Billboards
       </Link>
       <Link
        className={`${tab === "categories" ? "text-black" : ""}`}
        to={"/dashboard?tab=categories"}
       >
        Categories
       </Link>
       <Link
        className={`${tab === "sizes" ? "text-black" : ""}`}
        to={"/dashboard?tab=sizes"}
       >
        Sizes
       </Link>
       <Link
        className={`${tab === "colors" ? "text-black" : ""}`}
        to={"/dashboard?tab=colors"}
       >
        Colors
       </Link>
       <Link
        className={`${tab === "products" ? "text-black" : ""}`}
        to={"/dashboard?tab=products"}
       >
        Products
       </Link>
       <Link
        className={`${tab === "orders" ? "text-black" : ""}`}
        to={"/dashboard?tab=orders"}
       >
        Orders
       </Link>
       <Link
        className={`${tab === "settings" ? "text-black" : ""}`}
        to={"/dashboard?tab=settings"}
       >
        Settings
       </Link>
      </div>
     ) : (
      categories && (
       <div className="flex gap-3">
        {categories.map((category) => (
         <Link
          to={`/${category.name}`}
          key={category.id}
          className="font-semibold"
         >
          {category.name}
         </Link>
        ))}
       </div>
      )
     )}
    </div>
    <div className="flex items-center justify-center gap-4">
     <ModeToggle />
     <Button size="icon" variant="outline" onClick={() => nav("/wishlist")}>
      <Heart />
     </Button>
     {currentUser ? (
      <>
       <Link to="/cart" className="border p-2 rounded-lg">
        <ShoppingCart className="" />
       </Link>
       {auth.role === "admin" && (
        <Link to="/dashboard?tab=overview" className="border p-2 rounded-lg">
         <Settings className="" />
        </Link>
       )}

       <Button onClick={handelLogout}>Logout</Button>
      </>
     ) : (
      <Button onClick={handelLogin}>SignIn</Button>
     )}
    </div>
   </div>
  </div>
 );
};

export default Header;
