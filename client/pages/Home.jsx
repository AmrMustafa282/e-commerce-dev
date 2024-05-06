import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { loadData } from "@/redux/product/productSlice";
import { useNavigate } from "react-router-dom";
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
 Select,
 SelectContent,
 SelectGroup,
 SelectItem,
 SelectLabel,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlist/wishlist";
import { Skeleton } from "@/components/ui/skeleton";
const Home = () => {
 const nav = useNavigate();
 const dispatch = useDispatch();
 const { products: wishlist } = useSelector((state) => state.wishlist);
 const [billboard, setBillboard] = useState(null);
 const [fullproducts, setFullProducts] = useState([]);
 const [products, setProducts] = useState([]);
 const [categories, setCategories] = useState([]);
 const [colors, setColors] = useState([]);
 const [sizes, setSizes] = useState([]);
 const [loading, setLoading] = useState(false);

 const [filter, setFilter] = useState({
  order: "recentlyAdded",
  categories: [],
  colors: [],
  sizes: [],
 });

 const fetchRoot = async () => {
  setLoading(true);
  try {
   const res = await axios.get("/api/v1/categories");
   dispatch(loadData(res.data.categories));
   const extractedCategories = res.data.categories?.map(
    ({ id, name, createdAt, updatedAt }) => ({
     id,
     name,
     createdAt,
     updatedAt,
    })
   );
   setCategories(extractedCategories);
   const billboard = await axios.get("/api/v1/billboards/featured");
   const products = await axios.get(`/api/v1/products/featured`);
   setBillboard(billboard.data.billboard);
   setFullProducts(products.data.products); // ref to filter of
   setProducts(products.data.products); // ref to show up
  } catch (error) {
   console.error("Error fetching products:", error);
  } finally {
   setLoading(false);
  }
 };

 const fetchColors = async () => {
  try {
   const res = await axios.get("/api/v1/colors");
   if (res.status === 200) {
    setColors(res.data.colors);
   }
  } catch (err) {
   console.log(err);
  }
 };
 const fetchSizes = async () => {
  try {
   const res = await axios.get("/api/v1/sizes");
   if (res.status === 200) {
    setSizes(res.data.sizes);
   }
  } catch (err) {
   console.log(err);
  }
 };
 const handleArray = (field, item) => {
  if (filter[field].find((i) => i.id === item.id)) {
   // If itemId exists in the array, remove it
   setFilter((prevFilter) => ({
    ...prevFilter,
    [field]: prevFilter[field].filter((i) => i.id !== item.id),
   }));
  } else {
   // If itemId doesn't exist in the array, add it
   setFilter((prevFilter) => ({
    ...prevFilter,
    [field]: [...prevFilter[field], item],
   }));
  }
 };
 const handleFilter = async () => {
  let filteredProducts = fullproducts;

  if (filter.categories.length > 0) {
   filteredProducts = filteredProducts.filter((product) =>
    filter.categories.find((cat) => cat.id === product.categoryId)
   );
  }
  if (filter.colors.length > 0) {
   filteredProducts = filteredProducts.filter((product) =>
    filter.colors.find((color) => color.id === product.colorId)
   );
  }
  if (filter.sizes.length > 0) {
   filteredProducts = filteredProducts.filter((product) =>
    product.productSizes.some((productSize) =>
     // filter.sizes.includes(productSize.size)
     filter.sizes.find((i) => i.id === productSize.sizeId)
    )
   );
  }
  if (filter.order) {
   switch (filter.order) {
    case "recentlyAdded":
     filteredProducts.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
     });
     break;
    case "lowToHigh":
     filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
     break;
    case "highToLow":
     filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
     break;
    default:
     // Handle default case, maybe return unsorted products
     filteredProducts = products;
     break;
   }
  }
  setProducts(filteredProducts);
 };

 useEffect(() => {
  fetchRoot();
  fetchColors();
  fetchSizes();
 }, []);
 return (
  <div>
   {billboard ? (
    <div className="relative w-full h-[300px]">
     <img
      loading="lazy"
      src={`/img/billboard/${billboard.imageUrl}`}
      alt="billboard"
      className="w-full mt-4 mb-12"
     />
     <h1 className="absolute bottom-[45%] text-center w-full  text-5xl">
      {billboard.label}
     </h1>
    </div>
   ) : (
    <Skeleton className="w-full h-[290px] mb-12" />
   )}
   {products?.length > 0 ? (
    <>
     <div className="mb-4">
      <Sheet>
       <SheetTrigger asChild>
        <Button variant="outline">Filter</Button>
       </SheetTrigger>
       <SheetContent side="left">
        <SheetHeader>
         <SheetTitle>Filter products</SheetTitle>
         <SheetDescription>
          Search for products in your way to get best results.
         </SheetDescription>
        </SheetHeader>
        <div>
         <div className="mt-12">
          <div className="grid grid-cols-5 items-center ">
           <Label htmlFor="name">Order</Label>
           <Select
            value={filter.order}
            onValueChange={(val) => setFilter({ ...filter, order: val })}
           >
            <SelectTrigger className="col-span-4">
             <SelectValue placeholder="Recently added" />
            </SelectTrigger>
            <SelectContent>
             <SelectGroup>
              <SelectItem value="recentlyAdded">Recently added</SelectItem>
              <SelectItem value="mostRated">Most rated</SelectItem>
              <SelectItem value="lowToHigh">Price: low to high</SelectItem>
              <SelectItem value="highToLow">Price: high to low</SelectItem>
             </SelectGroup>
            </SelectContent>
           </Select>
          </div>
          <Separator className="my-4" />
         </div>
         <div className="mt-12">
          <h2 className="mb-4">Categories</h2>
          <div className="flex gap-2 flex-wrap mb-">
           {categories.map((cat) => (
            <div className="flex flex-col items-center gap-2" key={cat.id}>
             <Button
              type="button"
              variant="outline"
              onClick={() => handleArray("categories", cat)}
             >
              {cat.name}
             </Button>
             <span
              className="h-1 w-0 duration-300 animate-hGrow transition-all"
              style={
               filter.categories.includes(cat)
                ? { width: "90%", background: "gray" }
                : {}
              }
             ></span>
            </div>
           ))}
          </div>
          <Separator className="my-4 " />
         </div>
         <div className="mt-12">
          <h2 className="mb-4">Colors</h2>
          <div className="flex gap-2 flex-wrap ">
           {colors.map((color) => (
            <div className="flex flex-col items-center gap-2" key={color.id}>
             <Button
              type="button"
              style={{ background: `${color.value}` }}
              className="border"
              onClick={() => handleArray("colors", color)}
             ></Button>
             <span
              className="h-1 w-0 duration-300 animate-hGrow transition-all"
              style={
               filter.colors.includes(color)
                ? { width: "90%", background: "gray" }
                : {}
              }
             ></span>
            </div>
           ))}
          </div>
          <Separator className="my-4 " />
         </div>
         <div className="mt-12">
          <h2 className="mb-4">Sizes</h2>
          <div className="flex gap-2 flex-wrap mb-">
           {sizes.map((size) => (
            <div className="flex flex-col items-center gap-2" key={size.id}>
             <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleArray("sizes", size)}
             >
              {size.value}
             </Button>
             <span
              className="h-1 w-0 duration-300 animate-hGrow transition-all"
              style={
               filter.sizes.includes(size)
                ? { width: "90%", background: "gray" }
                : {}
              }
             ></span>
            </div>
           ))}
          </div>
          <Separator className="my-4 " />
         </div>
        </div>
        <SheetFooter>
         <SheetClose asChild>
          <Button type="button" onClick={handleFilter}>
           Apply
          </Button>
         </SheetClose>
        </SheetFooter>
       </SheetContent>
      </Sheet>
     </div>
     <div className="flex flex-wrap gap-4 items-center mb-12 ">
      {products.map((product) => (
       <Card
        key={product.id}
        className="w-[316px] h-[475px] group cursor-pointer rounded-sm"
       >
        <CardContent className="p-0 ">
         <div className="overflow-hidden relative ">
          <img
           loading="lazy"
           onClick={() => {
            nav(`/product/${product.id}`);
           }}
           src={`/img/product/${product.images[0]?.url}`}
           alt={"product.name"}
           className=" group-hover:scale-105 transition-all duration-300 w-[316px] h-[475px]"
          />
          <button
           onClick={() =>
            wishlist?.find((p) => p.id === product.id)
             ? dispatch(removeFromWishlist(product.id))
             : dispatch(addToWishlist(product))
           }
           className="absolute bottom-2 right-[45%] opacity-0 group-hover:opacity-100 group-hover:bottom-6 hover:scale-105 duration-300"
          >
           <Heart
            className="w-8 h-8"
            style={
             wishlist?.find((p) => p.id === product.id)
              ? { fill: "red", color: "red" }
              : {}
            }
           />
          </button>
         </div>
        </CardContent>
       </Card>
      ))}
     </div>
    </>
   ) : !loading ? (
    <h1>There are no available products!</h1>
   ) : (
    <div className="flex gap-4 flex-wrap mb-12">
     {[1, 2, 3, 4].map((skl) => (
      <Skeleton className="w-[316px] h-[475px]" key={skl} />
     ))}
    </div>
   )}
  </div>
 );
};

export default Home;
