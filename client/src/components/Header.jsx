import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { ModeToggle } from "./toggleTheme";
// import { NavigationMenuDemo } from "./Navigation";
import { signoutSuccess } from "@/redux/user/userSlice";
import {
 ShoppingCart,
 Settings,
 Heart,
 User,
 AlignJustify,
 Search,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
 Sheet,
 SheetClose,
 SheetContent,
 SheetDescription,
 SheetFooter,
 SheetHeader,
 SheetTitle,
 SheetTrigger,
} from "@/components/ui/sheet";
import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import axios from "axios";
import { setProducts } from "@/redux/product/productSlice";

const Header = () => {
 const nav = useNavigate();
 const { currentUser } = useSelector((state) => state.user);
 let { categories } = useSelector((state) => state.product);
 const [tab, setTab] = useState("overview");
 const [search, setSearch] = useState("");
 const [loading, setLoading] = useState(false);
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
 const handelSearch = async () => {
  if (search) {
   setLoading(true);
   try {
    const res = await axios.get(
     `/api/v1/products?search=${search.trim().toUpperCase()}`
    );
    if (res.data.status === "success") {
     dispatch(setProducts(res.data.products));
    }
   } catch (error) {
    console.log(error);
   } finally {
    setLoading(false);
   }
  } else {
   dispatch(setProducts(null));
  }
 };
 useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get("tab")) setTab(urlParams.get("tab"));
 }, [location.search]);

 return (
  <div className="py-2  w-full border-b">
   <div className="container mx-auto h-full flex justify-between items-center ">
    <div className="md:flex gap-6 items-center  hidden w-full">
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
       <div className="md:flex items-center gap-3 hidden  ">
        {categories.map((category) => (
         <Link
          to={`/${category.name}`}
          key={category.id}
          className=" font-semibold"
         >
          {category.name}
         </Link>
        ))}
       </div>
      )
     )}
    </div>
    <div className="md:flex items-center justify-center gap-4 hidden">
     {/* <ModeToggle /> */}
     <Dialog>
      <DialogTrigger asChild>
       <Button variant="outline" size="icon">
        <Search />
       </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl ">
       <div className="flex items-center space-x-2 mt-4">
        <div className="grid flex-1 gap-2">
         <Input
          placeholder="Search ..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
         />
        </div>
       </div>
       <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
         <Button
          className="ml-auto"
          type="button"
          variant="secondary"
          onClick={handelSearch}
          disabled={loading}
         >
          Search
         </Button>
        </DialogClose>
       </DialogFooter>
      </DialogContent>
     </Dialog>
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
       <DropdownMenu>
        <DropdownMenuTrigger
         asChild
         className="p-2 border box-content rounded-lg"
        >
         <User />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
         <DropdownMenuItem onClick={() => setTheme("light")}>
          Profile
         </DropdownMenuItem>
         <DropdownMenuItem onClick={handelLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
      </>
     ) : (
      <Button onClick={handelLogin}>SignIn</Button>
     )}
    </div>
    <div className="md:hidden flex justify-between items-center w-full">
     <Link to={"/"} className="font-bold text-2xl ">
      STORE
     </Link>
     <Sheet>
      <SheetTrigger asChild>
       <AlignJustify />
      </SheetTrigger>
      <SheetContent side="top">
       <div>
        <div className=" ">
         <Link to={"/"} className="font-bold text-2xl ">
          STORE
         </Link>
         <div className="">
          <Input
           placeholder="Search ..."
           onChange={(e) => setSearch(e.target.value)}
           value={search}
           className="mt-2"
          />
          <SheetClose className="w-full" onClick={handelSearch}>
           <Button className="w-full mt-2" variant="secondary" type="button">
            Search
           </Button>
          </SheetClose>
          <Separator className="my-4" />
         </div>

         {location.pathname.includes("dashboard") ? (
          <div className="flex flex-col gap-3 text-gray-700 mt-3  ">
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=overview"}
             style={
              tab === "overview" || undefined
               ? { background: "#F3F4F6", color: "black" }
               : {}
             }
            >
             Overview
            </Link>
           </SheetClose>
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=billboards"}
             style={
              tab === "billboards"
               ? { background: "#F3F4F6", color: "black" }
               : {}
             }
            >
             Billboards
            </Link>
           </SheetClose>
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=categories"}
             style={
              tab === "categories"
               ? { background: "#F3F4F6", color: "black" }
               : {}
             }
            >
             Categories
            </Link>
           </SheetClose>
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=sizes"}
             style={
              tab === "sizes" ? { background: "#F3F4F6", color: "black" } : {}
             }
            >
             Sizes
            </Link>
           </SheetClose>
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=colors"}
             style={
              tab === "colors" ? { background: "#F3F4F6", color: "black" } : {}
             }
            >
             Colors
            </Link>
           </SheetClose>
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=products"}
             style={
              tab === "products"
               ? { background: "#F3F4F6", color: "black" }
               : {}
             }
            >
             Products
            </Link>
           </SheetClose>
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=orders"}
             style={
              tab === "orders" ? { background: "#F3F4F6", color: "black" } : {}
             }
            >
             Orders
            </Link>
           </SheetClose>
           <SheetClose asChild>
            <Link
             className="px-4 p-2 rounded-lg"
             to={"/dashboard?tab=settings"}
             style={
              tab === "settings"
               ? { background: "#F3F4F6", color: "black" }
               : {}
             }
            >
             Settings
            </Link>
           </SheetClose>
          </div>
         ) : (
          categories && (
           <div className="flex flex-col gap-3 text-gray-700 mt-3 ">
            {categories?.map((category) => (
             <SheetClose asChild key={category.id}>
              <Link
               to={`/${category.name}`}
               className="font-semibold bg-gray-100 px-4 p-2 rounded-lg"
              >
               {category.name}
              </Link>
             </SheetClose>
            ))}
           </div>
          )
         )}
        </div>
        <Separator className="my-4 " />
       </div>
       <div>
        <h2 className="my-6 text-xl font-semibold">Taps</h2>
        <div className="flex flex-col  justify-center gap-4">
         {/* <ModeToggle /> */}
         <SheetClose asChild>
          <Link
           className="p-2 w-full flex justify-between items-center px-4 rounded-lg bg-gray-100"
           to={"/wishlist"}
          >
           <Label>Wishlist</Label>
           <Heart />
          </Link>
         </SheetClose>
         {currentUser ? (
          <>
           {" "}
           <SheetClose asChild>
            <Link to="/cart">
             <div className="py-2 w-full flex justify-between items-center px-4 rounded-lg bg-gray-100">
              <Label>Cart</Label>
              <ShoppingCart />
             </div>
            </Link>
           </SheetClose>
           {auth.role === "admin" && (
            <SheetClose asChild>
             <Link to="/dashboard?tab=overview">
              <div className="py-2 w-full flex justify-between items-center px-4 rounded-lg bg-gray-100">
               <Label>Dashboard</Label>
               <Settings />
              </div>
             </Link>
            </SheetClose>
           )}
           <DropdownMenu>
            <DropdownMenuTrigger
             asChild
             //  className="p-2 border box-content rounded-lg"
            >
             <div className="p-2 w-full flex justify-between items-center px-4 rounded-lg bg-gray-100">
              <Label>Account</Label>
              <User />
             </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
             <DropdownMenuItem onClick={() => {}}>
              <SheetClose>Profile</SheetClose>
             </DropdownMenuItem>
             <DropdownMenuItem onClick={handelLogout}>
              <SheetClose>Logout</SheetClose>
             </DropdownMenuItem>
            </DropdownMenuContent>
           </DropdownMenu>
          </>
         ) : (
          <Button onClick={handelLogin}>SignIn</Button>
         )}
        </div>
       </div>

       <SheetFooter>
        <SheetClose asChild>
         <Button type="button" className="mt-12">
          Close
         </Button>
        </SheetClose>
       </SheetFooter>
      </SheetContent>
     </Sheet>
    </div>
   </div>
  </div>
 );
};

export default Header;
