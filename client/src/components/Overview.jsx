import React from 'react'
import {DollarSign, CreditCard,Users,Layers3} from 'lucide-react'

 const Overview = () => {
  const dashboardItems = [
   {
    text: "Total Revenue",
    icon: <DollarSign />,
    value: "$59.00",
   },
   {
    text: "Sales",
    icon: <CreditCard />,
    value: "+12,313",
   },
   {
    text: "Products In Stock",
    icon: <Layers3 />,
    value: "99",
   },
   {
    text: "Customers",
    icon: <Users />,
    value: "+123",
   },
  ];
  return (
   <>
    <div className="py-4 border-b">
     <h1 className="font-bold text-4xl">Dashboard</h1>
     <p className="text-gray-700">Overview of your store</p>
    </div>
    <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4'>
     {dashboardItems.map((item,index) => (
      <div className='border px-6 py-4 rounded-lg  col-span-1' key={index}>
       <div className='flex justify-between mb-2'>
        <h3>{item.text}</h3>
        <span>{item.icon}</span>
       </div>
       <h2>{item.value}</h2>
      </div>
     ))}
    </div>
   </>
  );
}
export default Overview