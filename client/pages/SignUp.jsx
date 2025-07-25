"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SignupAlert from "@/components/SignupAlert";

const SignUp = (props) => {
 const nav = useNavigate();

 const onSubmit = async (values) => {
  console.log("Values: ", values);
  try {
   await axios.post("/api/v1/users/signup", values);
   nav("/login");
  } catch (err) {
   if (err && err instanceof AxiosError)
    toast.error(err.response?.data.message);
   else if (err && err instanceof Error) toast.error(err.message);
   console.log("Error: ", err);
  }
 };

 const formik = useFormik({
  initialValues: {
   username: "",
   email: "",
   password: "",
  },
  onSubmit,
 });

 return (
  <div className="my-32 h-full">
   <div className="flex justify-center items-center w-full">
    <div className="bg-white px-12 pb-12 pt-4 rounded-lg shadow-lg max-w-md w-full mx-4">
     <SignupAlert />

     <form onSubmit={formik.handleSubmit}>
      <h1 className="my-4 text-center font-semibold text-3xl">SignUp</h1>
      <div className="flex flex-col gap-4 w-full">
       <Input
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        placeholder="Username"
        type="text"
       />
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
       <Button disabled={formik.isSubmitting}>SignUp</Button>
       <p className="mt-8">
        Already have an account?{" "}
        <Link to="/login" className="underline text-blue-600">
         Login
        </Link>
       </p>
      </div>
     </form>
    </div>
   </div>
  </div>
 );
};

export default SignUp;
