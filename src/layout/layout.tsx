import React from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import classes from "./layout.module.scss";
import Header from "./header";
import Pages from "./pages";
import Footer from "../components/Footer/Footer";

const Layout: React.FC = () => {
  return (
    <>
      <div className={classes.wrapper}>
        <Router>
          <Header />
          <Pages />
          <Footer />
        </Router>
      </div>
    </>
  );
};

export default Layout;
