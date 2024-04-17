import { useEffect, useState } from "react";
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

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/v1/products");
      // console.log(res.data.products.length);
      setProducts(res.data.products);
    } catch (error) {
      console.log("something went wrong while fetching the products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const data = products;
  const handelDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/products/${id}`);
      if (res.status === 204) {
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Product deleted");
      }
    } catch (err) {
      toast.error("Fialed to delete this product");
    }
  };
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "isArchived",
      header: "Archived",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("isArchived") === true ? (
            <span>yes</span>
          ) : (
            <span>No</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("isFeatured") === true ? (
            <span>yes</span>
          ) : (
            <span>No</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="capitalize">${row.getValue("price")}</div>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.category?.name}</div>
      ),
    },
    {
      accessorKey: "size.name",
      header: "Size",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.size?.value}</div>
      ),
    },
    {
      accessorKey: "color.name",
      header: "Color",
      cell: ({ row }) => (
        <div className="capitalize flex items-center max-w-28 justify-between">
          <div>{row.original.color?.value}</div>
          <div
            style={{ backgroundColor: `${row.original.color?.value}` }}
            className="min-w-7 min-h-7 rounded-full inline-block border shadow-sm "
          ></div>
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
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
                    <Link
                      to={`/dashboard/product/${product.id}`}
                      className=" w-full"
                    >
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handelDelete(product.id)}>
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
          <h1 className="font-bold text-4xl">Products ({products.length})</h1>
          <p className="text-gray-700">Overview of your store</p>
        </div>
        <Link to={"/dashboard/product/create"}>
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

export default Products;
