import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { ModeToggle } from "./toggleTheme";
import { Button } from "./ui/button";
import { NavigationMenuDemo } from "./Navigation";
import { signoutSuccess } from "@/redux/user/userSlice";

const Header = () => {
 const { currentUser } = useSelector((state) => state.user);
 const dispatch = useDispatch();
 const signOut = useSignOut();
 const handelLogout = () => {
  signOut();
   dispatch(signoutSuccess());
   window.location.assign('/')
 };
  const handelLogin = () => {
    window.location.assign('/login')
  }

 return (
  <div className="py-2  w-full">
   <div className="container mx-auto h-full flex justify-between items-center">
    <h1 className="font-bold text-2xl">STORE</h1>
    <NavigationMenuDemo />
    <div className="md:flex gap-4 hidden">
     <ModeToggle />
     {currentUser ? (
      <Button onClick={handelLogout}>Logout</Button>
     ) : (
      <Button onClick={handelLogin}>SignIn</Button>
     )}
    </div>
   </div>
  </div>
 );
};

export default Header;
