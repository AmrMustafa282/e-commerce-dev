import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgetPassword = () => {
 const [email, setEmail] = useState("");

 const handelSubmit = async (e) => {
  e.preventDefault();
  if (!email) {
   return toast.error("No email provided!");
  }
  try {
   const promise = new Promise((resolve, reject) => {
    axios
     .post(`/api/v1/users/forgotPassword`, { email })
     .then((response) => {
      resolve(response.data);
     })
     .catch((error) => {
      reject(error);
     });
   });
   console.log(promise);
   toast.promise(() => promise, {
    loading: "Loading...",
    success: (data) => `${data.message}`,
    error: "Error",
   });
  } catch (error) {
   toast.error("An error occurred");
  }
  // if (res.data.status === "success") {
  //  toast.success("Check your email for verfication");
  // }
 };

 return (
  <div className="my-32 h-full">
   <div className="flex justify-center items-center w-full ">
    <div className="bg-white px-12 pb-12 pt-4 rounded-lg shadow-lg">
     <form onSubmit={handelSubmit}>
      <h1 className="my-4 text-center font-semibold text-3xl">
       Forget Password
      </h1>

      <div className="flex flex-col gap-4 w-full min-w-96">
       <Input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="user@mail.com"
        type="email"
       />
       <Button>Send Confirmation</Button>
       <p className="mt-8">
        Doesn't have an account yet?{" "}
        <Link to="/sign-up" className="underline text-blue-600">
         Sign Up
        </Link>
       </p>
      </div>
     </form>
    </div>
   </div>
  </div>
 );
};

export default ForgetPassword;
