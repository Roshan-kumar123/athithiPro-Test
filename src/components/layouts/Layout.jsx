import React from "react";
import Footer from "./Footer";
import MainNavigation from "./MainNavigation";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigation />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
