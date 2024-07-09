import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  return (
    <>
      <div className="navbar">
        <div>
          <img className="logo" src={assets.logo} alt="" />
        </div>
        <ul className="navbar-menu">
          <li
            onClick={() => setMenu("home")}
            className={menu === "home" ? "active" : ""}>
            home
          </li>
          <li
            onClick={() => setMenu("features")}
            className={menu === "features" ? "active" : ""}>
            features
          </li>
          <li
            onClick={() => setMenu("about-us")}
            className={menu === "about-us" ? "active" : ""}>
            about us
          </li>
          <li
            onClick={() => setMenu("how-to-use")}
            className={menu === "how-to-use" ? "active" : ""}>
            how to use
          </li>
          <li
            onClick={() => setMenu("contact-us")}
            className={menu === "contact-us" ? "active" : ""}>
            contact us
          </li>
        </ul>
        <div className="navbar-right">
          <button>sign in</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
