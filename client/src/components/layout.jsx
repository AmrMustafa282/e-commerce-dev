// import Header from "./Header";

const Layout = ({ children }) => {
 return (
  <div className="min-h-screen">
   {/* <Header /> */}
   <div className="container mx-auto">{children}</div>
  </div>
 );
};

export default Layout;
