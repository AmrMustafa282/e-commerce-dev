import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useDispatch } from "react-redux";
import {
 signInStart,
 signInFailure,
 signInSuccess,
} from "@/redux/user/userSlice";

import { toast } from "sonner";

const Login = () => {
 const dispatch = useDispatch();
 const nav = useNavigate();

 const signIn = useSignIn();

 const onSubmit = async (values) => {
  console.log("Values: ", values);

  try {
   dispatch(signInStart());
   const response = await axios.post("/api/v1/users/login", values);
   const options = {
    email: values.email,
    username: response.data.data.user.username,
   };

   if (!response.data.data.user.isConfirmed) {
    try {
     const res = await axios.post("/api/v1/users/sendConfirmation", {
      email: values.email,
     });
     if (res.data.status === "success") {
      toast.warning(
       "Verify your account first, we have sent verification to your email!"
      );
     }
    } catch (error) {
     toast.error(error);
    }
    dispatch(signInFailure());
    return;
   }
   if (response.data?.data?.user?.role === "admin") {
    options.role = "admin";
   }
   signIn({
    auth: {
     token: response.data.token,
    },
    userState: options,
   });
   dispatch(signInSuccess(response.data));
   nav("/");
  } catch (err) {
   dispatch(signInFailure());
   if (err && err instanceof AxiosError)
    toast.error(err.response?.data.message);
   else if (err && err instanceof Error) toast.error(err.message);

   console.log("Error: ", err);
  }
 };

 const formik = useFormik({
  initialValues: {
   email: "",
   password: "",
  },
  onSubmit,
 });

 return (
  <div className="my-32 h-full">
   <div className="flex justify-center items-center w-full ">
    <div className="bg-white pb-12 pt-4 rounded-lg">
     <form onSubmit={formik.handleSubmit} className="mx-auto">
      <h1 className="my-4 text-center font-semibold text-3xl">Login</h1>

      <div className="flex flex-col gap-4 w-full min-w-80">
       <Input
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        placeholder="Email"
        type="email"
       />
       <Input
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        placeholder="Password"
        type="password"
       />
       <Button disabled={formik.isSubmitting}>Login</Button>
       <Link to="/forget-password" className="text-xs underline text-blue-600">
        Forget Password?
       </Link>
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

export default Login;
