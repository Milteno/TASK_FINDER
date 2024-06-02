import React from "react";
import { Link } from "react-router-dom";
import classes from "./topNav.module.scss";
import logo from "../../images/logo_inz.png";
import { logoutSuccess } from "../../redux/features/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";

const TopNav: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutSuccess());
  };

  return (
    <nav>
      <div className={classes.navWrapper}>
        <div className={classes.navLogo}>
          <img src={logo} alt="Logo" className={classes.companyLogo} />
          <span className={classes.companyLogoTitle}>QuickTask</span>
        </div>
        <div>
          <ul className={classes.navLinks}>
            <li>
              <Link to="/home">Home</Link>
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
            {user ? (
              <li>
                <p>Welcome, {user.username}</p>
                <button onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
