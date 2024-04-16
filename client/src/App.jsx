import { Routes, Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import { Toaster } from "./components/ui/sonner";

import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Layout from "./components/Layout";
import Cart from "../pages/Cart";
import Category from "../pages/Category";
import Dashboard from "../pages/Dashboard";
import Restrict from "./components/Restrict";
import UpdateBillboard from "../pages/Billboard/UpdateBillboard";
import CreateBillboard from "../pages/Billboard/CreateBillboard";

function App() {
 // const [products, setProducts] = useState([])
 // const [data, setData] = useState([])

 //   const dispatch = useDispatch();

 //   const fetchProducts = async () => {
 //    try {
 //     const res = await axios.get("/api/v1/categories");
 //      setData(res.data.categories)
 //      setProducts(res.data[0].categories.products)
 //      console.log(res.data.categories)
 //     dispatch(loadData(res.data.categories));
 //    } catch (error) {
 //     console.error("Error fetching products:", error);
 //    }
 //   };

 //   useEffect(() => {
 //    fetchProducts();
 //   }, []);
 return (
  <>
   <Layout>
    <Routes>
     <Route path="/login" element={<Login />} />
     <Route path="/sign-up" element={<SignUp />} />
     <Route path="/" element={<Home />} />
     <Route path="/:categoryName" element={<Category />} />
     <Route element={<AuthOutlet fallbackPath="/login" />}>
      <Route path="/cart" element={<Cart />} />
      <Route element={<Restrict />}>
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/dashboard/billboard/create" element={<CreateBillboard />} />
       <Route path="/dashboard/billboard/:billboardId" element={<UpdateBillboard />} />
      </Route>
     </Route>
    </Routes>
   </Layout>
   <Toaster position="top-center" richColors />
  </>
 );
}

export default App;
