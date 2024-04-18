import React, { useState } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";

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

  const nav = useNavigate();

  const handleSubmit = async () => {
    //  event.preventDefault();

    const formData = new FormData();
    if (label !== "") {
      formData.append("label", label);
    }
    if (image !== null) {
      formData.append("image", image);
    }

    try {
      const res = await axios.patch(
        `/api/v1/billboards/${billboardId}`,
        formData,
      );
      toast.success("Billboard updated");
      setTimeout(() => {
        nav("/dashboard?tab=billboards");
      }, 1000);
    } catch (error) {
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
      <div className="py-4 border-b flex justify-between items-end">
        <h1 className="font-bold text-4xl">Updated billboard</h1>
        <p className="text-gray-700">Updated an existing billboard</p>
      </div>
      <div className="my-4">
        <Label htmlFor="label" className="font-semibold text-md">
          Label
        </Label>
        <Input
          onChange={handleLabelChange}
          type="text"
          id="label"
          name="label"
          className="mt-4 mb-8 "
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
          className="mt-4 mb-8 "
        />
        {imagePreview && (
          <img src={imagePreview} alt="Uploaded" className="max-w-full mb-4" />
        )}{" "}
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </>
  );
};

export default UpdateBillboard;
