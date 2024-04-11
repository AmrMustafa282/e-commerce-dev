import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { ModeToggle } from "./toggleTheme";
import { Button } from "./ui/button";
import { NavigationMenuDemo } from "./Navigation";
import { signoutSuccess } from "@/redux/user/userSlice";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
 const { currentUser } = useSelector((state) => state.user);
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

 return (
  <div className="py-2  w-full">
   <div className="container mx-auto h-full flex justify-between items-center">
    <h1 className="font-bold text-2xl">STORE</h1>
    <NavigationMenuDemo />
    <div className="flex items-center justify-center gap-4">
     <ModeToggle />
     {currentUser ? (
      <>
       <Link to="/cart" className="border p-2 rounded-lg">
        <ShoppingCart className=""/>
       </Link>
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
