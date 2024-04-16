import React, { useEffect, useState } from "react";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { Navigate, Outlet } from "react-router-dom";
const Restrict = ({ children }) => {
  const auth = useAuthUser()
  return auth.role === 'admin' ? <Outlet /> : <Navigate to={"/"} />;
};

export default Restrict;
