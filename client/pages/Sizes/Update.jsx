import React, { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateSize = () => {
 const params = useParams();
 const { sizeId } = params;
 const [name, setName] = useState("");
 const [value, setValue] = useState("");
 const [loading, setLoading] = useState(false);

 const nav = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const options = {};
  if (name) {
   options.name = name;
  }
  if (value) {
   options.value = value;
  }
  try {
   const res = await axios.patch(`/api/v1/sizes/${sizeId}`, options);
   if (res.status === 200) {
    toast.success("Size updated");
   }
   console.log(res.data);
   setTimeout(() => {
    nav("/dashboard?tab=sizes");
   }, 1000);
  } catch (error) {
   toast.error(error);
  } finally {
   setLoading(false);
  }
 };
 const handleNameChange = (event) => {
  setName(event.target.value);
 };
 const handleValueChange = (val) => {
  setValue(val.target.value);
 };

 return (
  <>
   <div className="py-4 border-b flex justify-between items-end">
    <h1 className="font-bold text-4xl">Updated size</h1>
    <p className="text-gray-700">Updated an existing size</p>
   </div>
   <form onSubmit={handleSubmit} className="my-4">
    <Label htmlFor="name" className="font-semibold text-base">
     Name
    </Label>
    <Input
     onChange={handleNameChange}
     type="text"
     id="name"
     name="name"
     className="mt-4 mb-8 "
     placeholder="size name"
    />
    <Label htmlFor="value" className="font-semibold text-base">
     Value
    </Label>
    <Input
     onChange={handleValueChange}
     type="text"
     id="value"
     name="value"
     className="mt-4 mb-8 "
     placeholder="size (XL)"
    ></Input>
    <Button type="submit" disabled={loading}>
     Save
    </Button>
   </form>
  </>
 );
};

export default UpdateSize;
