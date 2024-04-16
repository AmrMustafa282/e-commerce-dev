import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const CreateColor = () => {
 const [name, setName] = useState("");
 const [value, setValue] = useState("");

 const nav = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
   try {
     if (!name || !value) {
      return toast.warning('Name or value is missing!')
     }
   const res = await axios.post("/api/v1/colors", {
    name,
    value,
   });
    if (res.status === 201) {
   toast.success("Color created");
    }
   console.log(res.data);
   setTimeout(() => {
    nav("/dashboard?tab=colors");
   }, 2000);
  } catch (error) {
   toast.error(error);
  }
 };
  
 const handleNameChange = (event) => {
  setName(event.target.value);
 };
 const handleValueChange = (event) => {
  setValue(event.target.value);
 };
 
 return (
  <>
   <div className="py-4 border-b">
    <h1 className="font-bold text-4xl">Create Color</h1>
    <p className="text-gray-700">Add a new color</p>
   </div>
   <form className="my-4" onSubmit={handleSubmit}>
    <Label htmlFor="name" className="font-semibold text-md">
     Name
    </Label>
    <Input
     onChange={handleNameChange}
     type="text"
     id="name"
     name="name"
     className="mt-4 mb-8"
     placeholder="color name"
    />
    <Label htmlFor="value" className="font-semibold text-md">
     Value
    </Label>
    <Input
     onChange={handleValueChange}
     type="text"
     id="value"
     name="value"
     className="mt-4 mb-8"
     placeholder="color (#FFFFFF)"
    />
    <Button type="submit">Create</Button>
   </form>
  </>
 );
};

export default CreateColor;
