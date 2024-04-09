import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../src/components/ui/input";
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

const Login = (props) => {
 const dispatch = useDispatch();
 const nav = useNavigate();
 const [error, setError] = useState("");
 const signIn = useSignIn();

 const onSubmit = async (values) => {
  console.log("Values: ", values);
  setError("");

  try {
   dispatch(signInStart());
   const response = await axios.post(
     "http://localhost:8000/api/v1/users/login",
     values
   );
   signIn({
     auth: {
       token: response.data.token,
      },
    userState: {
     email: values.email,
     username: response.data.data.user.username,
    },
  });
  dispatch(signInSuccess(response.data));
  nav("/");
} catch (err) {
    dispatch(signInFailure());
   if (err && err instanceof AxiosError) setError(err.response?.data.message);
   else if (err && err instanceof Error) setError(err.message);

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
    <div className="bg-white px-12 pb-12 pt-4 rounded-lg shadow-lg">
     <form onSubmit={formik.handleSubmit}>
      <h1 className="my-4 text-center font-semibold text-3xl">Login</h1>
      <p>{error}</p>
      <div className="flex flex-col gap-4 w-full min-w-96">
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
