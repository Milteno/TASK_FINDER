import React from "react";
import classes from "./mainPage.module.scss";
import Notes from "../../components/notes/Notes";

const MainPage: React.FC = () => {
  return (
    <>
      <div className={classes.mainPageWrapper}>
        <div className={classes.mainPageContent}>
          <Notes />
        </div>
      </div>
    </>
  );
};

export default MainPage;
