import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateBillboard = () => {
 const params = useParams();
 const { billboardId } = params;
 const [label, setLabel] = useState("");
 const [image, setImage] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);
 const [loading, setLoading] = useState(false);

 const nav = useNavigate();

 const handleSubmit = async () => {
  setLoading(true);
  //  event.preventDefault();

  const formData = new FormData();
  if (label !== "") {
   formData.append("label", label);
  }
  if (image !== null) {
   formData.append("image", image);
  }

  try {
   const res = await axios.patch(`/api/v1/billboards/${billboardId}`, formData);
   toast.success("Billboard updated");
   setTimeout(() => {
    nav("/dashboard?tab=billboards");
   }, 1000);
  } catch (error) {
   toast.error(error);
  } finally {
   setLoading(false);
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

 useEffect(() => {
  const getBillboard = async () => {
   try {
    const res = await axios.get(`/api/v1/billboards/${billboardId}`);
    if (res.data.status === "success") {
     setLabel(res.data.data.data.label);
     setImagePreview(res.data.data.data.imageUrl);
    }
   } catch (error) {
    toast.error("something went wrong");
   }
  };
  getBillboard();
 }, [billboardId]);
 return (
  <>
   <div className="py-4 border-b flex justify-between items-end">
    <h1 className="font-bold text-4xl">Updated billboard</h1>
    <p className="text-gray-700">Updated an existing billboard</p>
   </div>
   <div className="my-4">
    <Label htmlFor="label" className="font-semibold text-base">
     Label
    </Label>
    <Input
     onChange={handleLabelChange}
     type="text"
     id="label"
     name="label"
     className="mt-4 mb-8 "
     placeholder="billboard label"
     value={label}
    />
    <Label htmlFor="image" className="font-semibold text-base">
     Background image
    </Label>
    <Input
     onChange={handleImageChange}
     type="file"
     id="image"
     name="image"
     className="mt-4 mb-8 "
    />
    {imagePreview && (
     <img
      loading="lazy"
      src={imagePreview}
      alt="Uploaded"
      className="max-w-full mb-4"
     />
    )}{" "}
    <Button onClick={handleSubmit} disabled={loading}>
     Save
    </Button>
   </div>
  </>
 );
};

export default UpdateBillboard;
