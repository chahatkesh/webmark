import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <>
      <div className="header">
        <div className="header-contents">
          <h2>Simplify Your Bookmark Management.</h2>
          <p>
            Webmark is an online bookmark manager designed to help you organize
            and access your bookmarks easily.
          </p>
          <button>Start Free Trial</button>
        </div>
      </div>
    </>
  );
};

export default Header;
