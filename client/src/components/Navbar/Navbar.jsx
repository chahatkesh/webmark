import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <div>
          <img className="logo" src={assets.logo} alt="" />
        </div>
        <ul className="navbar-menu">
          <li>home</li>
          <li>features</li>
          <li>about us</li>
          <li>how to use</li>
          <li>contact us</li>
        </ul>
        <div className="navbar-right">
          <button>Get Started</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
