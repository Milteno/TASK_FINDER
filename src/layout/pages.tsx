import React, { useEffect } from "react";
import classes from "./pages.module.scss";
import { ROUTES } from "../pages/routes";
import { Route, Routes, useNavigate } from "react-router-dom";

const Pages: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/register");
    }
  }, [navigate]);
  return (
    <>
      <div className={classes.pageContent}>
        <Routes>
          {ROUTES.map((route: any) => (
            <Route key={route.id} path={route.url} element={route.component} />
          ))}
        </Routes>
      </div>
    </>
  );
};

export default Pages;
