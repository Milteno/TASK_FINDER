import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import classes from "./topNav.module.scss";
import logo from "../../images/logo_inz.png";
import { logoutSuccess } from "../../redux/features/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";

const TopNav: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
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
              <Link to="/map">Mapa</Link>
            </li>
            <li>
              <Link to="/tasks">Ogłoszenia</Link>
            </li>
            <li>
              <Link to="/services">O nas</Link>
            </li>
            <li>
              <Link to="/contact">Kontakt</Link>
            </li>
            {user.token && user.username !== "undefined" ? (
              <li className={classes.userMenu}>
                Witaj, {user.username}
                <button
                  className={classes.userNavButton}
                  onClick={() => navigate("/user-settings")}
                >
                  <FontAwesomeIcon icon={faCog} className={classes.icon} />
                </button>
                <button
                  onClick={handleLogout}
                  className={classes.userNavButton}
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className={classes.icon}
                  />
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Zaloguj się</Link>
                </li>
                <li>
                  <Link to="/register">Zarejestruj się</Link>
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
