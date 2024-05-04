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

const Sizes = () => {
 const [sizes, setSizes] = useState([]);
 const fetchSizes = async () => {
  try {
   const res = await axios.get("/api/v1/sizes");
   setSizes(res.data.sizes);
  } catch (error) {
   console.log("something went wrong while fetching the sizes");
  }
 };
 useEffect(() => {
  fetchSizes();
 }, []);
 const data = sizes;
 const handelDelete = async (id) => {
  try {
   const res = await axios.delete(`/api/v1/sizes/${id}`);
   if (res.status === 204) {
    setSizes(sizes.filter((size) => size.id !== id));
    toast.success("Size deleted");
   }
  } catch (err) {
   toast.error("Fialed to delete this size");
  }
 };

 const columns = [
  {
   accessorKey: "name",
   header: "Name",
   cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
   accessorKey: "value",
   header: "Value",
   cell: ({ row }) => (
    <div className="capitalize ">
     <div>{row.original.value}</div>
    </div>
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
    const size = row.original;
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
          <Link to={`/dashboard/size/${size.id}`} className=" w-full">
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
          <AlertDialogAction onClick={() => handelDelete(size.id)}>
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
     <h1 className="font-bold text-4xl">Sizes ({sizes?.length})</h1>
     <p className="text-gray-700">Overview of your sizes</p>
    </div>
    <Link to={"/dashboard/size/create"}>
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

export default Sizes;
