import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, CheckCheck, Trash2 } from "lucide-react";

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
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

const Orders = () => {
 const [orders, setOrders] = useState([]);
 const fetchOrders = async () => {
  try {
   const res = await axios.get("/api/v1/orders");
   setOrders(res.data.orders);
  } catch (error) {
   console.log("something went wrong while fetching the orders");
  }
 };

 const handelRecived = async (order) => {
  if (order.isPaid || order.status === "Sent") {
   await axios.patch(`/api/v1/orders/${order.id}`, {
    status: "Recived",
   });
  } else {
   return;
  }
 };
 useEffect(() => {
  fetchOrders();
 }, []);

 const data = orders;
 const handelDelete = async (id) => {
  try {
   const res = await axios.delete(`/api/v1/orders/deleteCompletedOrders`);
   if (res.status === 204) {
    setOrders(
     orders.filter((order) => order.isPaid && order.status !== "Recived")
    );
    toast.success("Compoleted orders has been deleted");
   } else {
    toast.error("There are not compoleted orders");
   }
  } catch (err) {
   toast.error("There are not compoleted orders");
  }
 };
 const columns = [
  {
   accessorKey: "id",
   header: "ID",
   cell: ({ row }) => (
    <button
     className="relative group "
     onClick={() => copyToClipboard(row.getValue("id"), "order-id")}
    >
     <div className="capitalize w-12 line-clamp-1 ">{row.getValue("id")}</div>
     <span className="absolute min-w-[300px] -top-8 bg-gray-300 px-2 py-1 rounded-md opacity-0 duration-300 group-hover:opacity-100">
      {row.getValue("id")}
     </span>
    </button>
   ),
  },
  {
   accessorKey: "userId",
   header: "UserID",
   cell: ({ row }) => (
    <button
     className="relative group "
     onClick={() => copyToClipboard(row.getValue("userId"), "user-id")}
    >
     <div className="capitalize w-12 line-clamp-1 ">
      {row.getValue("userId")}
     </div>
     <span className="absolute min-w-[300px] -top-8 bg-gray-300 px-2 py-1 rounded-md opacity-0 duration-300 group-hover:opacity-100">
      {row.getValue("userId")}
     </span>
    </button>
   ),
  },
  {
   accessorKey: "status",
   header: "Status",
   cell: ({ row }) => (
    <div className="capitalize ">{row.getValue("status")}</div>
   ),
  },
  {
   accessorKey: "isPaid",
   header: "Paid",
   cell: ({ row }) => (
    <div className="capitalize w-12 line-clamp-1">
     {row.original.isPaid.toString()}
    </div>
   ),
  },

  {
   accessorKey: "updatedAt",
   header: () => <div>Date</div>,
   cell: ({ row }) => (
    <div className="capitalize">
     {new Date(row.getValue("updatedAt")).toLocaleDateString()}
    </div>
   ),
  },
  {
   accessorKey: "recived",
   header: () => <div>Recived</div>,
   cell: ({ row }) => (
    <Button
     size="icon"
     variant="ghost"
     onClick={() => handelRecived(row.original)}
    >
     {row.getValue("isPaid") ? (
      <CheckCheck
       style={row.getValue("status") === "Recived" ? { color: "#0679FB" } : {}}
      />
     ) : (
      <Check />
     )}
    </Button>
   ),
  },
 ];

 return (
  <>
   <div className="py-4 border-b flex justify-between items-end">
    <div>
     <h1 className="font-bold text-4xl">Orders ({orders?.length})</h1>
     <p className="text-gray-700">Overview of your orders</p>
    </div>
    <AlertDialog>
     <AlertDialogTrigger asChild>
      <Button variant="destructive">
       <Trash2 className="p-[3px] mb-1" /> Reset
      </Button>
     </AlertDialogTrigger>
     <AlertDialogContent>
      <AlertDialogHeader>
       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
       <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        completed orders and remove your data from our servers.
       </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
       <AlertDialogCancel>Cancel</AlertDialogCancel>
       <AlertDialogAction onClick={handelDelete}>Continue</AlertDialogAction>
      </AlertDialogFooter>
     </AlertDialogContent>
    </AlertDialog>
   </div>
   <div className="my-4">
    <DataTableDemo data={data} columns={columns} searchKey={"status"} />
   </div>
  </>
 );
};

export default Orders;
