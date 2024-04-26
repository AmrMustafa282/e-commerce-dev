import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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

const Category = () => {
 const [data, setData] = useState([]);
 const [products, setProducts] = useState([]);
 const [fullproducts, setFullproducts] = useState([]);
 const [colors, setColors] = useState([]);
 const [sizes, setSizes] = useState([]);
 const params = useParams();
 const nav = useNavigate();

 const uniqueColors = new Set();
 const uniqueSizes = new Set();

 const [filter, setFilter] = useState({
  order: "recentlyAdded",
  colors: [],
  sizes: [],
 });

 const fetchCategory = async () => {
  try {
   const products = await axios.get(
    `/api/v1/categories/${params.categoryName}`
   );
   setData([products.data.category]);
   setProducts(products.data.category.products);
   setFullproducts(products.data.category.products);
   products.data.category.products.forEach((product) => {
    uniqueColors.add(product.color.value);

    const sizes = product.productSizes.map((size) => size.size.value);
    console.log(sizes);
    sizes.forEach((size) => uniqueSizes.add(size));
   });

   setColors(Array.from(uniqueColors));
   setSizes(Array.from(uniqueSizes));
  } catch (error) {
   console.error("Error fetching products:", error);
  }
 };

 const handleArray = (field, item) => {
  if (filter[field].find((i) => i === item)) {
   // If itemId exists in the array, remove it
   setFilter((prevFilter) => ({
    ...prevFilter,
    [field]: prevFilter[field].filter((i) => i !== item),
   }));
  } else {
   // If itemId doesn't exist in the array, add it
   setFilter((prevFilter) => ({
    ...prevFilter,
    [field]: [...prevFilter[field], item],
   }));
  }
 };
 console.log(filter);
const handleFilter = () => {
 let filteredProducts = fullproducts;

 if (filter.colors.length > 0) {
  filteredProducts = filteredProducts.filter((product) =>
   filter.colors.includes(product.color.value)
  );
 }

 if (filter.sizes.length > 0) {
  filteredProducts = filteredProducts.filter((product) =>
   product.productSizes.some((productSize) =>
    filter.sizes.includes(productSize.size.value)
   )
  );
 }

 if (filter.order) {
  switch (filter.order) {
   case "recentlyAdded":
    filteredProducts.sort(
     (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    break;
   case "lowToHigh":
    filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    break;
   case "highToLow":
    filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    break;
   default:
    break;
  }
 }
 setProducts(filteredProducts);
};


 useEffect(() => {
  fetchCategory();
 }, [params.categoryName]);

 return (
  <>
   {data.length > 0 && (
    <div className="relative">
     <img
      src={`/img/billboard/${data[0].billboard.imageUrl}`}
      alt="billboard"
      className="w-full mt-4 mb-12"
     />
     <h1 className="absolute bottom-[45%] text-center w-full  text-5xl">
      {data[0].billboard.label}
     </h1>
    </div>
   )}
   {products.length > 0 ? (
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
          <h2 className="mb-4">Colors</h2>
          <div className="flex gap-2 flex-wrap ">
           {colors.map((color) => (
            <div className="flex flex-col items-center gap-2">
             <Button
              type="button"
              style={{ background: `${color}` }}
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
            <div className="flex flex-col items-center gap-2">
             <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleArray("sizes", size)}
             >
              {size}
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
     <div className="flex gap-4 flex-wrap mb-12 ">
      {products.map((product, index) => (
       <Card
        key={product.id}
        className="w-[316px] h-[475px] group cursor-pointer rounded-sm"
        onClick={() => {
         nav(`/product/${product.id}`);
        }}
       >
        <CardContent className="p-0 ">
         <div className="overflow-hidden relative ">
          <img
           src={`/img/product/${product.images[0]?.url}`}
           alt={"product.name"}
           className=" group-hover:scale-105 transition-all duration-300 w-[316px] h-[475px]"
          />
         </div>
        </CardContent>
       </Card>
      ))}
     </div>
    </>
   ) : (
    <h1>Loading</h1>
   )}
  </>
 );
};

export default Category;
