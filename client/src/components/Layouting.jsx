import React from "react";
import Header from "./Header";

const Layouting = ({ children }) => {
 return (
  <div className="min-h-screen">
   <Header />
   <div className="container mx-auto">{children}</div>
  </div>
 );
};

export default Layouting;
