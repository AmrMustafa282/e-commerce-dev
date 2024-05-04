import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
 const nav = useNavigate();
 const { token } = useParams();
 const [formData, setFormData] = useState({
  password: "",
  passwordConfirm: "",
 });
 console.log(formData);
 const handelSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.passwordConfirm) {
   return toast.error("Password doesn't match");
  }

  const res = await axios.patch(`/api/v1/users/resetPassword/${token}`, {
   password: formData.password,
  });
  if (res.data.status === "success") {
   toast.success("Password reset successfully");
   nav("/login");
  }
 };

 return (
  <div className="my-32 h-full">
   <div className="flex justify-center items-center w-full ">
    <div className="bg-white px-12 pb-12 pt-4 rounded-lg shadow-lg">
     <form onSubmit={handelSubmit}>
      <h1 className="my-4 text-center font-semibold text-3xl">
       Reset Password
      </h1>

      <div className="flex flex-col gap-4 w-full min-w-96">
       <Input
        name="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        type="password"
       />
       <Input
        name="passwordConfirm"
        value={formData.passwordConfirm}
        onChange={(e) =>
         setFormData({ ...formData, passwordConfirm: e.target.value })
        }
        placeholder="Password Confirm"
        type="password"
       />
       <Button>Confirm</Button>
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

export default ResetPassword;
