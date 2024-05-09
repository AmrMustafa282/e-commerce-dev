import React, { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectGroup,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";

const UpdateCategory = () => {
 const params = useParams();
 const { categoryId } = params;
 const [name, setName] = useState("");
 const [billboardId, setBillboardId] = useState("");
 const [billboards, setBillboards] = useState([]);
 const [loading, setLoading] = useState(false);

 const nav = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const options = {};
  if (name) options.name = name;
  if (billboardId) options.billboardId = billboardId;
  try {
   const res = await axios.patch(`/api/v1/categories/${categoryId}`, options);
   if (res.status === 200) {
    toast.success("Category updated");
   }
   console.log(res.data);
   setTimeout(() => {
    nav("/dashboard?tab=categories");
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
 const handleBillboardIdChange = (val) => {
  setBillboardId(val);
 };
 const fetchBillboards = async () => {
  const res = await axios.get("/api/v1/billboards");
  setBillboards(res.data.billboards);
 };
 useEffect(() => {
  fetchBillboards();
 }, []);
 return (
  <>
   <div className="py-4 border-b flex justify-between items-end">
    <h1 className="font-bold text-4xl">Updated category</h1>
    <p className="text-gray-700">Updated an existing category</p>
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
     placeholder="category name"
    />
    <Label htmlFor="billboardId" className="font-semibold text-base">
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
          <SelectItem value={billboard.id}>{billboard.label}</SelectItem>
         ))}
       </SelectGroup>
      </SelectContent>
     </Select>
    </div>
    <Button type="submit" disabled={loading}>
     Save
    </Button>
   </form>
  </>
 );
};

export default UpdateCategory;
