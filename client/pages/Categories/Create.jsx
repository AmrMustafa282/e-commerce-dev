import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectGroup,
 SelectItem,
 SelectLabel,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";

const CreateCategory = () => {
 const [name, setName] = useState("");
 const [billboardId, setBillboardId] = useState("");
 const [billboards, setBillboards] = useState([]);

 const nav = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
   try {
     if (!name || !billboardId) {
      return toast.warning('Name or billboard is missing!')
     }
   const res = await axios.post("/api/v1/categories", {
    name,
    billboardId,
   });
    if (res.status === 201) {
   toast.success("Category created");
    }
   console.log(res.data);
   setTimeout(() => {
    nav("/dashboard?tab=categories");
   }, 2000);
  } catch (error) {
   toast.error(error);
  }
 };
 const handleNameChange = (event) => {
  setName(event.target.value);
 };
 const handleBillboardIdChange = (val) => {
  setBillboardId(val);
  console.log(val);
 };
 const fetchBillboards = async () => {
  const res = await axios.get("/api/v1/billboards");
  setBillboards(res.data.billboards);
 };
  useEffect(() => {
   fetchBillboards()
 }, []);
 return (
  <>
     <div className="py-4 border-b">
       
    <h1 className="font-bold text-4xl">Create category</h1>
    <p className="text-gray-700">Add a new category</p>
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
     placeholder="category name"
    />
    <Label htmlFor="billboardId" className="font-semibold text-md">
     Billboard
    </Label>
    <div className="mt-4 mb-8">
     <Select id="billboardId" onValueChange={handleBillboardIdChange}>
      <SelectTrigger className="">
       <SelectValue placeholder="Select a billboard" />
      </SelectTrigger>
      <SelectContent>
       <SelectGroup>
        {billboards.length > 0 &&
         billboards.map((billboard) => (
          <SelectItem value={billboard.id}>
           {billboard.label}
          </SelectItem>
         ))}
       </SelectGroup>
      </SelectContent>
     </Select>
    </div>
    <Button type="submit">Create</Button>
   </form>
  </>
 );
};

export default CreateCategory;
