import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
 Carousel,
 CarouselContent,
 CarouselItem,
 CarouselScrollTo,
} from "@/components/ui/carousel";
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
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formater } from "@/lib/formater";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ArrowBigUp, MoreHorizontal, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
const ProductDetails = () => {
 const params = useParams();
 //  const { scrollTo } = useCarousel;
 const { productId } = params;
 const [product, setProduct] = useState(null);
 const [reviews, setReviews] = useState(null);
 const [currentSize, setCurrentSize] = useState(null);
 const [index, setIndex] = useState(0);
 const [text, setText] = useState("");
 const [rating, setRating] = useState(0);

 const userId = useSelector((state) => state.user.currentUser.data.user.id);

 let nav = useNavigate();
 const fetchProduct = async (id = productId) => {
  try {
   const res = await axios.get(`/api/v1/products/${id}`);
   if (res.status === 200) {
    setProduct(res.data.product);
    setCurrentSize(res.data.product.productSizes[0].size);
   }
   //  nav(`/product/${id}`);
   fetchReviews(id);
  } catch (error) {
   console.error("Error fetching product:", error);
  }
 };
 const fetchReviews = async (id) => {
  try {
   const res = await axios.get(`/api/v1/reviews/${id}`);
   if (res.status === 200) {
    setReviews(res.data.reviews);
   }
  } catch (error) {
   console.error("Error fetching reviews:", error);
  }
 };
 const handleUpvote = async (reviewId) => {
  try {
   const res = await axios.put(`/api/v1/reviews/${reviewId}`);
   const updatedReview = res.data.review;
   setReviews(
    reviews.map((review) => {
     if (review.id === updatedReview.id) {
      review.upvoteCount = updatedReview.upvoteCount;
      review.upvotes = updatedReview.upvotes;
     }
     return review;
    })
   );
  } catch (error) {
   console.log(error);
  }
 };
 const isUpvoted = (upvotes) => {
  return upvotes.find((upvote) => upvote.userId == userId);
 };
 const createReview = async () => {
  if (!text || !rating) {
   return toast.warning("Review or rating is missing!");
  }
  const res = await axios.post(`/api/v1/reviews/${productId}`, {
   text,
   rating,
  });
  if (res.data.status === "success") {
   setText("");
   setRating(0);
   setReviews((prev) => [res.data.review, ...prev]);
  }
 };

 const deleteReview = async (reviewId) => {
  const res = await axios.delete(`/api/v1/reviews/${reviewId}`);
  if (res.status === 204) {
   setReviews(reviews.filter((rev) => rev.id !== reviewId));
  }
 };
 const updateReview = async (reviewId) => {
  if (!text || !rating) {
   return toast.warning("review or rating is missing!");
  }
  const res = await axios.patch(`/api/v1/reviews/${reviewId}`, {
   text,
   rating,
  });
  let updatedReview = res.data.review;
  if (res.status === 200) {
   setReviews(
    reviews.map((review) => {
     if (review.id === updatedReview.id) {
      review.text = updatedReview.text;
      review.rating = updatedReview.rating;
     }
     return review;
    })
   );
  }
 };

 const addToCart = async () => {
  const res = await axios.post("/api/v1/orders/");
  if (res.status === 201) {
   const res2 = await axios.post(
    `/api/v1/orders/${res.data.order.id}/${productId}`,
    { size: currentSize.name }
   );
   if (res2.status === 201) {
    toast.success("Product has been added to your cart");
   }
  }
 };
 // console.log(reviews[0])
 useEffect(() => {
  fetchProduct();
 }, [productId]);

 return (
  <>
   {product && (
    <div className=" my-12">
     <div className="flex flex-col  gap-4 md:flex-row mb-12">
      <div className="flex-1 ">
       <Carousel
        className=" w-[558px] h-[837px] overflow-hidden"
        opts={{
         align: "start",
         loop: true,
         dragFree: true,
        }}
       >
        <CarouselContent className="">
         {product.images.slice(1).map((image, index) => (
          <CarouselItem className="" key={index}>
           <div className="p-1">
            <Card className="w-[558px] h-[837px] group cursor-pointer">
             <CardContent className="p-0">
              <div className="overflow-hidden relative">
               <img
                src={`/img/product/${image.url}`}
                alt={product.name}
                className="w-full h-full"
               />
              </div>
             </CardContent>
            </Card>
           </div>
          </CarouselItem>
         ))}
        </CarouselContent>
        <CarouselScrollTo index={index} />
       </Carousel>
      </div>
      <div className="flex-1 mt-4 flex flex-col justify-between ">
       <div>
        <h1 className="font-bold text-4xl mb-8">{product.name}</h1>
        <span className="w-20 h-2 bg-black block" />
        <h2 className="font-semibold text-3xl my-8">
         {formater(product.price)}
        </h2>
        <p className="text-lg text-gray-500 mb-6">{product.description}</p>
        <p className="text-lg text-gray-500 mb-2">
         CHECK IN-STORE AVAILABILITY
        </p>
        <p className="text-lg text-gray-500 ">
         SHIPPING, EXCHANGES AND RETURNS
        </p>
        <hr className="my-8" />
        <span className="text-2xl font-semibold ">
         Size : <span className="font-normal">{currentSize.name}</span>
        </span>
        <div className="flex gap-4">
         {product.productSizes?.map((e) => (
          <button
           key={e.id}
           type="button"
           onClick={() => setCurrentSize(e.size)}
           className="relative  cursor-pointer w-12 h-16 mt-4 mb-8 bg-black text-white font-bold text-xl rounded-md"
          >
           <div
            className="h-2 w-0  absolute -bottom-3   duration-300 animate-hGrow transition-all"
            style={
             currentSize.id === e.size.id
              ? { width: "100%", background: "black" }
              : {}
            }
           ></div>
           {e.size.value}
          </button>
         ))}
        </div>

        <span className="text-2xl font-semibold ">
         Color : <span className="font-normal">{product.color.name}</span>
        </span>
        <div className="flex gap-4">
         {product.relatedProducts.products?.map((product) => (
          <Button
           key={product.id}
           style={{ backgroundColor: `${product.color.value}` }}
           className="cursor-pointer hover:scale-105 duration-300 transition-all w-fit px-6 py-8 my-4  text-white font-extrabold text-2xl"
           onClick={() => nav(`/product/${product.id}`)}
          ></Button>
         ))}
        </div>
       </div>
       <Button className="w-full " onClick={addToCart}>
        ADD TO CART
       </Button>
      </div>
     </div>
     <div className="flex mt-4">
      {product.images.slice(1).map((image, i) => (
       <img
        key={i}
        src={`/img/product/${image.url}`}
        alt={product.name}
        className="w-[105px] h-[158px] cursor-pointer mx-2 border border-gray-300"
        onClick={() => setIndex(i)}
        style={i === index ? { border: "solid 2px black" } : {}}
       />
      ))}
     </div>
     <div className="flex flex-col gap-4 mb-12 mt-20 container ">
      <Dialog>
       <DialogTrigger asChild>
        <Button variant="outline">Add Review</Button>
       </DialogTrigger>
       <DialogContent className="sm:max-w-[60vw]">
        <DialogHeader>
         <DialogTitle>Review</DialogTitle>
         <DialogDescription>
          Make you review specific and helpful.
         </DialogDescription>
        </DialogHeader>
        <div className="mb-4 w-full flex flex-col gap-3 ">
         <Textarea
          placeholder="What is on your mind ..."
          onChange={(e) => {
           setText(e.target.value);
          }}
         />
         <div className="flex ">
          {[1, 2, 3, 4, 5].map((e) => (
           <Star
            key={e}
            className={`text-amber-500 cursor-pointer hover:scale-125 duration-300`}
            style={e <= rating ? { fill: "#facc15" } : {}}
            onClick={() => setRating(e)}
            onMouseEnter={() => setRating(e)}
           />
          ))}
         </div>
        </div>
        <DialogFooter>
         <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={createReview}>
           Add
          </Button>
         </DialogClose>
        </DialogFooter>
       </DialogContent>
      </Dialog>

      <hr />
      {reviews &&
       reviews.map((review) => (
        <div key={review.id}>
         <div className="flex items-center gap-4 ">
          <Avatar>
           <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
           <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Label>{review.user.username}</Label>
          {review.userId === userId && (
           <div className="flex-grow text-end">
            <Dialog>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0 ">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
               </Button>
              </DropdownMenuTrigger>
              <AlertDialog>
               <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DialogTrigger asChild>
                 <DropdownMenuItem
                  onClick={() => {
                   setText(review.text);
                   setRating(review.rating);
                  }}
                 >
                  Update
                  {/* <Button variant="outline">Add Review</Button> */}
                 </DropdownMenuItem>
                </DialogTrigger>
                {/* <DropdownMenuItem> */}
                <AlertDialogTrigger asChild>
                 <DropdownMenuItem>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
                {/* </DropdownMenuItem> */}
               </DropdownMenuContent>
               <AlertDialogContent>
                <AlertDialogHeader>
                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                 <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                 </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                 <AlertDialogAction onClick={() => deleteReview(review.id)}>
                  Continue
                 </AlertDialogAction>
                </AlertDialogFooter>
               </AlertDialogContent>
              </AlertDialog>
             </DropdownMenu>

             {/* <DialogTrigger asChild>
              <Button variant="outline">Add Review</Button>
             </DialogTrigger> */}
             <DialogContent className="sm:max-w-[60vw]">
              <DialogHeader>
               <DialogTitle>Review</DialogTitle>
               <DialogDescription>
                Make you review specific and helpful.
               </DialogDescription>
              </DialogHeader>
              <div className="mb-4 w-full flex flex-col gap-3 ">
               <Textarea
                value={text}
                placeholder="What is on your mind ..."
                onChange={(e) => {
                 setText(e.target.value);
                }}
               />
               <div className="flex ">
                {[1, 2, 3, 4, 5].map((e) => (
                 <Star
                  key={e}
                  className={`text-amber-500 cursor-pointer hover:scale-125 duration-300`}
                  style={e <= rating ? { fill: "#facc15" } : {}}
                  onClick={() => setRating(e)}
                  onMouseEnter={() => setRating(e)}
                 />
                ))}
               </div>
              </div>
              <DialogFooter>
               <DialogClose asChild>
                <Button
                 type="button"
                 variant="secondary"
                 onClick={() => updateReview(review.id)}
                >
                 Save
                </Button>
               </DialogClose>
              </DialogFooter>
             </DialogContent>
            </Dialog>
           </div>
          )}
         </div>
         <div className="flex my-1">
          {[1, 2, 3, 4, 5].map((e) => (
           <Star
            key={e}
            className={`text-amber-500 `}
            style={e <= review.rating ? { fill: "#facc15" } : {}}
           />
          ))}
         </div>
         <div>{review.text}</div>
         <div className="flex items-center gap-4 my-2">
          <Button
           size="icon"
           variant="outline"
           type="button"
           onClick={() => handleUpvote(review.id)}
          >
           <ArrowBigUp
            style={
             isUpvoted(review.upvotes) ? { fill: "green", color: "green" } : {}
            }
            className=" w-10 h-10 stroke-[1px] cursor-pointer hover:-translate-y-[1px] duration-300 transition-all"
           />
          </Button>
          <Label>{review.upvoteCount}</Label>
         </div>
         <hr className="mt-2" />
        </div>
       ))}
     </div>
    </div>
   )}
  </>
 );
};

export default ProductDetails;
