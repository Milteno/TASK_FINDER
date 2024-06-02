import React from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import classes from "./layout.module.scss";

const Layout: React.FC = () => {
  return (
    <>
      <div className={classes.wrapper}>
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>
        </Router>
      </div>
    </>
  );
};

export default Layout;
