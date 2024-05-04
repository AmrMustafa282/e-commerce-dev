import React, { useEffect, useState } from "react";
import axios from "axios";
import { MoreHorizontal, Plus } from "lucide-react";

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
import { Button } from "./ui/button";
import DataTableDemo from "./DataTable";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Categories = () => {
 const [categories, setCategories] = useState([]);
 const fetchCategories = async () => {
  try {
   const res = await axios.get("/api/v1/categories");
   setCategories(res.data.categories);
  } catch (error) {
   console.log("something went wrong while fetching the categories");
  }
 };
 useEffect(() => {
  fetchCategories();
 }, []);
 const data = categories;
 const handelDelete = async (id) => {
  try {
   const res = await axios.delete(`/api/v1/categories/${id}`);
   if (res.status === 204) {
    setCategories(categories.filter((category) => category.id !== id));
    toast.success("Category deleted");
   }
  } catch (err) {
   toast.error("Fialed to delete this category");
  }
 };
  
 const columns = [
  {
   accessorKey: "name",
   header: "Name",
   cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
   accessorKey: "billboard.label",
   header: "Billboard",
   cell: ({ row }) => (
    <div className="capitalize">{row.original.billboard?.label}</div>
   ),
  },

  {
   accessorKey: "updatedAt",
   header: () => <div>Date</div>,
   cell: ({ row }) => (
    <div className="capitalize">
     {new Date(row.getValue("updatedAt")).toLocaleString()}
    </div>
   ),
  },
  {
   id: "actions",
   enableHiding: false,
   cell: ({ row }) => {
    const category = row.original;
    return (
     <div className="text-right">
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
         <DropdownMenuItem>
          <Link to={`/dashboard/category/${category.id}`} className=" w-full">
           Update
          </Link>
         </DropdownMenuItem>
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
           This action cannot be undone. This will permanently delete your
           account and remove your data from our servers.
          </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handelDelete(category.id)}>
           Continue
          </AlertDialogAction>
         </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>
      </DropdownMenu>
     </div>
    );
   },
  },
 ];

 return (
  <>
   <div className="py-4 border-b flex justify-between items-end">
    <div>
     <h1 className="font-bold text-4xl">Categories ({categories?.length})</h1>
     <p className="text-gray-700">Overview of your categories</p>
    </div>
    <Link to={"/dashboard/category/create"}>
     <Button>
      <Plus className="w-4 mr-2" /> Add New
     </Button>
    </Link>
   </div>
   <div className="my-4">
    <DataTableDemo data={data} columns={columns} searchKey={"name"} />
   </div>
  </>
 );
};

export default Categories;
