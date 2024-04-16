import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateBillboard = () => {
 const [label, setLabel] = useState("");
 const [image, setImage] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);

 const nav = useNavigate();

 const handleSubmit = async () => {
  //  event.preventDefault();

  const formData = new FormData();
  formData.append("label", label);
  formData.append("image", image);
  console.log(formData);

  try {
   const res = await axios.post("/api/v1/billboards", formData);
   console.log(res.data);
   toast.success("Billboard created");
   setTimeout(() => {
    nav("/dashboard?tab=billboards");
   }, 2000);
  } catch (error) {
   // Handle error, maybe show a toast
   toast.error(error);
  }
 };
 const handleLabelChange = (event) => {
  setLabel(event.target.value);
 };
 const handleImageChange = (event) => {
  const uploadedImage = event.target.files[0];
  setImage(uploadedImage);

  // Show preview of the image
  const reader = new FileReader();
  reader.onload = () => {
   setImagePreview(reader.result);
  };
  reader.readAsDataURL(uploadedImage);
 };
 return (
  <>
   <div className="py-4 border-b ">
    <h1 className="font-bold text-4xl">Create billboard</h1>
    <p className="text-gray-700">Add a new billboard</p>
   </div>
   {/* <form className="my-4" onSubmit={handleSubmit}> */}
   <Label htmlFor="label" className="font-semibold text-md">
    Label
   </Label>
   <Input
    onChange={handleLabelChange}
    type="text"
    id="label"
    name="label"
    className="mt-4 mb-8"
    placeholder="billboard label"
   />
   <Label htmlFor="image" className="font-semibold text-md">
    Background image
   </Label>
   <Input
    onChange={handleImageChange}
    type="file"
    id="image"
    name="image"
    className="mt-4 mb-8"
   />
   {imagePreview && (
    <img src={imagePreview} alt="Uploaded" className="max-w-full mb-4" />
   )}
   <Button onClick={handleSubmit}>Create</Button>
   {/* </form> */}
  </>
 );
};

export default CreateBillboard;
