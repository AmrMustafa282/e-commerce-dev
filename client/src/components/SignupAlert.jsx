"use client";

import { Info, User, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SignupAlert = () => {
 const navigate = useNavigate();

 const handleTryAccount = (email, password) => {
  navigate("/login", {
   state: {
    email: email,
    password: password,
   },
  });
 };

 return (
  <Alert className="mb-6 border-green-200 bg-green-50">
   <Info className="h-4 w-4 text-green-600" />
   <AlertDescription className="text-green-800">
    <div className="space-y-3">
     <p className="font-medium text-sm">
      Already have demo accounts? Try these instead:
     </p>

     <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-green-100">
       <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-600" />
        <div>
         <p className="font-medium">Normal User</p>
         <p className="text-gray-600">
          Email: <span className="font-mono">user@me.com</span>
         </p>
         <p className="text-gray-600">
          Password: <span className="font-mono">123</span>
         </p>
        </div>
       </div>
       <Button
        size="sm"
        variant="outline"
        onClick={() => handleTryAccount("user@me.com", "123")}
        className="text-xs border-green-300 text-green-700 hover:bg-green-100"
       >
        Try
       </Button>
      </div>

      <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-green-100">
       <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-amber-600" />
        <div>
         <p className="font-medium">Admin User</p>
         <p className="text-gray-600">
          Email: <span className="font-mono">admin@me.com</span>
         </p>
         <p className="text-gray-600">
          Password: <span className="font-mono">123</span>
         </p>
        </div>
       </div>
       <Button
        size="sm"
        variant="outline"
        onClick={() => handleTryAccount("admin@me.com", "123")}
        className="text-xs border-green-300 text-green-700 hover:bg-green-100"
       >
        Try
       </Button>
      </div>
     </div>
    </div>
   </AlertDescription>
  </Alert>
 );
};

export default SignupAlert;
