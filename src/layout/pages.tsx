import React from "react";
import classes from "./pages.module.scss";
import { ROUTES } from "../pages/routes";
import { Route, Routes } from "react-router-dom";

const Pages: React.FC = () => {
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
