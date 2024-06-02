import React from "react";
import { Link } from "react-router-dom";
import classes from "./topNav.module.scss"; // Import pliku SCSS

const TopNav: React.FC = () => {
  return (
    <div className={classes.navWrapper}>
      <ul className={classes.navLinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNav;
