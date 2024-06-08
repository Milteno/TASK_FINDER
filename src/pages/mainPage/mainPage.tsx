import React from "react";
import classes from "./mainPage.module.scss";

const MainPage: React.FC = () => {
  return (
    <>
      <div className={classes.mainPageWrapper}>
        <div className={classes.mainPageContent}></div>
      </div>
    </>
  );
};

export default MainPage;
