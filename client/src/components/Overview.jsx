import React, { useEffect, useState } from "react";
import { DollarSign, CreditCard, Users, Layers3 } from "lucide-react";
import axios from "axios";
import { formater } from "@/lib/formater";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Overview = () => {
 const [states, setStates] = useState({});
 const dashboardItems = [
  {
   text: "Total Revenue",
   icon: <DollarSign />,
   value: formater(states?.totalRevenue),
  },
  {
   text: "Sales",
   icon: <CreditCard />,
   value: states?.sales,
  },
  {
   text: "Products In Store",
   icon: <Layers3 />,
   value: states?.products,
  },
  {
   text: "Customers",
   icon: <Users />,
   value: states?.customers,
  },
 ];
 const fetchStates = async () => {
  try {
   const res = await axios.get("/api/v1/products/getStates");
   if (res.data.status === "success") {
    setStates(res.data);
   }
  } catch (error) {
   console.log(error);
  }
 };
 useEffect(() => {
  fetchStates();
 }, []);
 const data = [
  { total: 5, name: "first" },
  { total: 10, name: "second" },
  { total: 15, name: "thirs" },
 ];

 return (
  <>
   <div className="py-4 border-b">
    <h1 className="font-bold text-4xl">Dashboard</h1>
    <p className="text-gray-700">Overview of your store</p>
   </div>
   <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
    {dashboardItems.map((item, index) => (
     <div className="border px-6 py-4 rounded-lg  col-span-1" key={index}>
      <div className="flex justify-between mb-2">
       <h3>{item.text}</h3>
       <span>{item.icon}</span>
      </div>
      <h2>{item.value}</h2>
     </div>
    ))}
   </div>
   <div className="mb-12">
    <Card>
     <CardHeader>
      <CardTitle>Overview</CardTitle>
     </CardHeader>
     <CardContent className="pl-2 h-[40vh] ">
      <ResponsiveContainer width="100%" height="100%">
       <BarChart width={150} height={40} data={states?.graphData}>
        <XAxis
         stroke="#888888"
         fontSize={12}
         tickLine={false}
         axisLine={false}
         dataKey={"name"}
        />
        <YAxis
         tickFormatter={(val) => `$${val}`}
         stroke="#888888"
         fontSize={12}
         tickLine={false}
         axisLine={false}
        />
        <Bar dataKey="total" fill="#2318f0" radius={[4, 4, 0, 0]} />
       </BarChart>
      </ResponsiveContainer>
     </CardContent>
    </Card>
   </div>
  </>
 );
};
export default Overview;
