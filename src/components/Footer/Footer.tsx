import React from "react";
import classes from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <p>
          &copy; {new Date().getFullYear()} QuickTask. Wszystkie prawa
          zastrzeżone.
        </p>
        <div className={classes.links}></div>
      </div>
    </footer>
  );
};

export default Footer;
