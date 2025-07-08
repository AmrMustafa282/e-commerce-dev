"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
 Trash2,
 MoreHorizontal,
 Edit,
 UserX,
 UserCheck,
 Shield,
 Eye,
} from "lucide-react";
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
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import DataTableDemo from "./DataTable";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

const Settings = () => {
 const [users, setUsers] = useState([]);
 const [selectedUser, setSelectedUser] = useState(null);
 const [editDialogOpen, setEditDialogOpen] = useState(false);
 const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
 const [viewDialogOpen, setViewDialogOpen] = useState(false);
 const [editForm, setEditForm] = useState({
  username: "",
  email: "",
  role: "",
  isActive: true,
 });

 const fetchUsers = async () => {
  try {
   const res = await axios.get("/api/v1/users");
   setUsers(res.data.users);
  } catch (error) {
   console.error("Error fetching users", error);
  }
 };

 const handleDeleteInactive = async () => {
  try {
   const res = await axios.delete(`/api/v1/users/deleteInactive`);
   if (res.status === 204) {
    setUsers(users.filter((user) => user.isActive));
    toast.success("Inactive users deleted successfully");
   } else {
    toast.error("No inactive users to delete");
   }
  } catch (err) {
   toast.error("Failed to delete inactive users");
  }
 };

 const handleEditUser = async () => {
  try {
   const res = await axios.patch(`/api/v1/users/${selectedUser.id}`, editForm);
   if (res.status === 200) {
    setUsers(
     users.map((user) =>
      user.id === selectedUser.id ? { ...user, ...editForm } : user
     )
    );
    toast.success("User updated successfully");
    setEditDialogOpen(false);
   }
  } catch (error) {
   toast.error("Failed to update user");
  }
 };

 const handleDeleteUser = async () => {
  try {
   const res = await axios.delete(`/api/v1/users/${selectedUser.id}`);
   if (res.status === 204) {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    toast.success("User deleted successfully");
    setDeleteDialogOpen(false);
   }
  } catch (error) {
   toast.error("Failed to delete user");
  }
 };

 const handleToggleActiveStatus = async (user) => {
  try {
   const res = await axios.patch(`/api/v1/users/${user.id}`, {
    isActive: !user.isActive,
   });
   if (res.status === 200) {
    setUsers(
     users.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
    );
    toast.success(
     `User ${!user.isActive ? "activated" : "deactivated"} successfully`
    );
   }
  } catch (error) {
   toast.error("Failed to update user status");
  }
 };

 const openEditDialog = (user) => {
  setSelectedUser(user);
  setEditForm({
   username: user.username,
   email: user.email,
   role: user.role,
   isActive: user.isActive,
  });
  setEditDialogOpen(true);
 };

 const openDeleteDialog = (user) => {
  setSelectedUser(user);
  setDeleteDialogOpen(true);
 };

 const openViewDialog = (user) => {
  setSelectedUser(user);
  setViewDialogOpen(true);
 };

 useEffect(() => {
  fetchUsers();
 }, []);

 const ActionDropdown = ({ user }) => (
  <DropdownMenu>
   <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="h-8 w-8 p-0">
     <span className="sr-only">Open menu</span>
     <MoreHorizontal className="h-4 w-4" />
    </Button>
   </DropdownMenuTrigger>
   <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem onClick={() => openViewDialog(user)}>
     <Eye className="mr-2 h-4 w-4" />
     View Details
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => openEditDialog(user)}>
     <Edit className="mr-2 h-4 w-4" />
     Edit User
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => handleToggleActiveStatus(user)}>
     {user.isActive ? (
      <>
       <UserX className="mr-2 h-4 w-4" />
       Deactivate
      </>
     ) : (
      <>
       <UserCheck className="mr-2 h-4 w-4" />
       Activate
      </>
     )}
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
     onClick={() => openDeleteDialog(user)}
     className="text-red-600"
    >
     <Trash2 className="mr-2 h-4 w-4" />
     Delete User
    </DropdownMenuItem>
   </DropdownMenuContent>
  </DropdownMenu>
 );

 const columns = [
  {
   accessorKey: "id",
   header: "ID",
   cell: ({ row }) => (
    <button
     className="relative group"
     onClick={() => copyToClipboard(row.getValue("id"), "user-id")}
    >
     <div className="w-16 truncate">{row.getValue("id")}</div>
     <span className="absolute z-10 bg-gray-300 px-2 py-1 rounded-md -top-8 opacity-0 duration-300 group-hover:opacity-100">
      {row.getValue("id")}
     </span>
    </button>
   ),
  },
  {
   accessorKey: "username",
   header: "Username",
   cell: ({ row }) => (
    <div className="capitalize">{row.getValue("username")}</div>
   ),
  },
  {
   accessorKey: "email",
   header: "Email",
   cell: ({ row }) => <div className="truncate">{row.getValue("email")}</div>,
  },
  {
   accessorKey: "role",
   header: "Role",
   cell: ({ row }) => (
    <div className="capitalize flex items-center">
     {row.getValue("role") === "admin" && <Shield className="mr-1 h-4 w-4" />}
     {row.getValue("role")}
    </div>
   ),
  },
  {
   accessorKey: "isActive",
   header: "Active",
   cell: ({ row }) => <div>{row.getValue("isActive") ? "✅" : "❌"}</div>,
  },
  {
   accessorKey: "isConfirmed",
   header: "Confirmed",
   cell: ({ row }) => <div>{row.getValue("isConfirmed") ? "✅" : "❌"}</div>,
  },
  {
   accessorKey: "createdAt",
   header: "Created At",
   cell: ({ row }) => (
    <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
   ),
  },
  {
   id: "actions",
   header: "Actions",
   cell: ({ row }) => <ActionDropdown user={row.original} />,
  },
 ];

 return (
  <>
   <div className="py-4 border-b flex justify-between items-end">
    <div>
     <h1 className="font-bold text-4xl">Users ({users.length})</h1>
     <p className="text-gray-700">Overview of registered users</p>
    </div>
    <AlertDialog>
     <AlertDialogTrigger asChild>
      <Button variant="destructive">
       <Trash2 className="mr-1" size={18} /> Delete Inactive
      </Button>
     </AlertDialogTrigger>
     <AlertDialogContent>
      <AlertDialogHeader>
       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
       <AlertDialogDescription>
        This action will permanently delete all inactive users.
       </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
       <AlertDialogCancel>Cancel</AlertDialogCancel>
       <AlertDialogAction onClick={handleDeleteInactive}>
        Confirm
       </AlertDialogAction>
      </AlertDialogFooter>
     </AlertDialogContent>
    </AlertDialog>
   </div>

   <div className="my-4">
    <DataTableDemo data={users} columns={columns} searchKey={"username"} />
   </div>

   {/* Edit User Dialog */}
   <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
    <DialogContent className="sm:max-w-[425px]">
     <DialogHeader>
      <DialogTitle>Edit User</DialogTitle>
      <DialogDescription>
       Make changes to the user account here. Click save when you're done.
      </DialogDescription>
     </DialogHeader>
     <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
       <Label htmlFor="username" className="text-right">
        Username
       </Label>
       <Input
        id="username"
        value={editForm.username}
        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
        className="col-span-3"
       />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
       <Label htmlFor="email" className="text-right">
        Email
       </Label>
       <Input
        id="email"
        type="email"
        value={editForm.email}
        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
        className="col-span-3"
       />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
       <Label htmlFor="role" className="text-right">
        Role
       </Label>
       <Select
        value={editForm.role}
        onValueChange={(value) => setEditForm({ ...editForm, role: value })}
       >
        <SelectTrigger className="col-span-3">
         <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
         <SelectItem value="user">User</SelectItem>
         <SelectItem value="admin">Admin</SelectItem>
         <SelectItem value="moderator">Moderator</SelectItem>
        </SelectContent>
       </Select>
      </div>
     </div>
     <DialogFooter>
      <Button type="submit" onClick={handleEditUser}>
       Save changes
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>

   {/* Delete User Dialog */}
   <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
       This action cannot be undone. This will permanently delete the user
       account for <strong>{selectedUser?.username}</strong> and remove all
       their data from our servers.
      </AlertDialogDescription>
     </AlertDialogHeader>
     <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
       onClick={handleDeleteUser}
       className="bg-red-600 hover:bg-red-700"
      >
       Delete
      </AlertDialogAction>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>

   {/* View User Dialog */}
   <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
    <DialogContent className="sm:max-w-[425px]">
     <DialogHeader>
      <DialogTitle>User Details</DialogTitle>
      <DialogDescription>
       Detailed information about {selectedUser?.username}
      </DialogDescription>
     </DialogHeader>
     {selectedUser && (
      <div className="grid gap-4 py-4">
       <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">ID:</Label>
        <div className="col-span-3 text-sm">{selectedUser.id}</div>
       </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Username:</Label>
        <div className="col-span-3">{selectedUser.username}</div>
       </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Email:</Label>
        <div className="col-span-3">{selectedUser.email}</div>
       </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Role:</Label>
        <div className="col-span-3 capitalize flex items-center">
         {selectedUser.role === "admin" && <Shield className="mr-1 h-4 w-4" />}
         {selectedUser.role}
        </div>
       </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Status:</Label>
        <div className="col-span-3">
         {selectedUser.isActive ? (
          <span className="text-green-600">Active</span>
         ) : (
          <span className="text-red-600">Inactive</span>
         )}
        </div>
       </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Confirmed:</Label>
        <div className="col-span-3">
         {selectedUser.isConfirmed ? (
          <span className="text-green-600">Yes</span>
         ) : (
          <span className="text-orange-600">Pending</span>
         )}
        </div>
       </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Created:</Label>
        <div className="col-span-3">
         {new Date(selectedUser.createdAt).toLocaleDateString()}
        </div>
       </div>
       {selectedUser.orders && (
        <div className="grid grid-cols-4 items-center gap-4">
         <Label className="text-right font-semibold">Orders:</Label>
         <div className="col-span-3">{selectedUser.orders.length}</div>
        </div>
       )}
      </div>
     )}
    </DialogContent>
   </Dialog>
  </>
 );
};

export default Settings;
