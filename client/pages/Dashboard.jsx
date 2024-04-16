import React, { useEffect, useState } from "react";
import Billboards from "@/components/Billboards";
import Categories from "@/components/Categories";
import Colors from "@/components/Colors";
import Orders from "@/components/Orders";
import Overview  from "@/components/Overview";
import Products from "@/components/Products";
import Settings from "@/components/Settings";
import Sizes from "@/components/Sizes";
import {useLocation} from 'react-router-dom'
const Dashboard = () => {
  const [tab, setTab] = useState('overview');
  const location = useLocation();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if(urlParams.get('tab')) setTab(urlParams.get('tab'))
  },[location.search])

  return (
    <>
    {(tab==='overview' || undefined) && <Overview />}
    {tab==='billboards' && <Billboards />}
    {tab==='categories' && <Categories />}
    {tab==='sizes' && <Sizes />}
    {tab==='colors' && <Colors />}
    {tab==='products' && <Products />}
    {tab==='orders' && <Orders />}
    {tab==='settings' && <Settings />}
    </>
  )
};

export default Dashboard;
