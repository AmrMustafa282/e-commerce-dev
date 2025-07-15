"use client";

import { Info, User, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";


const DemoAlert = ({ onTryAccount }) => {
 return (
  <Alert className="mb-6 border-blue-200 bg-blue-50">
   <Info className="h-4 w-4 text-blue-600" />
   <AlertDescription className="text-blue-800">
    <div className="space-y-3">
     <p className="font-medium text-sm">Demo Accounts for Testing:</p>

     <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-blue-100">
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
        onClick={() => onTryAccount("user@me.com", "123")}
        className="text-xs"
       >
        Try
       </Button>
      </div>

      <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-blue-100">
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
        onClick={() => onTryAccount("admin@me.com", "123")}
        className="text-xs"
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

export default DemoAlert;
