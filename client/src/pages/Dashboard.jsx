import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import Loader from "../components/Loader";
import { assets } from "../assets/assests";

const Dashboard = () => {
  const { url, token, setToken } = useContext(StoreContext);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [useremail, setUseremail] = useState(
    localStorage.getItem("useremail") || ""
  );
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    setToken("");
    setUsername("");
    setUseremail("");
    navigate("/auth");
  }, [navigate, setToken]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${url}/api/user/userdata`,
        {},
        { headers: { token } }
      );
      const { username: fetchedUsername, useremail: fetchedUseremail } =
        response.data;

      if (fetchedUsername) {
        setUsername(fetchedUsername);
        localStorage.setItem("username", fetchedUsername);
      }
      if (fetchedUseremail) {
        setUseremail(fetchedUseremail);
        localStorage.setItem("useremail", fetchedUseremail);
      }
    } catch (error) {
      alert("Error fetching user data: " + error);
    }
  }, [url, token]);

  useEffect(() => {
    if (!username || !useremail) {
      fetchUserData();
    }
  }, [username, useremail, fetchUserData]);

  // loader start
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  // loder ends
  const [menu, setMenu] = useState("dashboard");
  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col w-[100vw] h-[100vh]">
      {/* header */}
      <div className="bg-white pl-10 pr-10 h-[4rem] flex justify-between items-center">
        <div className="flex items-center">
          <a className="inline-flex" href="">
            <img width={28} src={assets.small_logo_color} alt="" />
          </a>
          <p className="pl-4 text-xl">
            Welcome{" "}
            <span className="font-[600] italic text-gray-500">
              {username || useremail || "User"}
            </span>
          </p>
        </div>
        <nav className="hidden md:flex text-[#374252]">
          <ul className="flex flex-grow flex-wrap justify-center items-center gap-4 lg:gap-8 text-sm">
            <li
              onClick={() => setMenu("dashboard")}
              className={
                menu === "dashboard"
                  ? "bg-gray-50 text-black font-[500] cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
                  : "cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
              }>
              dashboard
            </li>
            <li
              onClick={() => setMenu("more tools")}
              className={
                menu === "more tools"
                  ? "bg-gray-50 text-black font-[500] cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
                  : "cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
              }>
              more tools
            </li>
            <li
              onClick={() => setMenu("how to use")}
              className={
                menu === "how to use"
                  ? "bg-gray-50 text-black font-[500] cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
                  : "cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
              }>
              how to use
            </li>
            <li
              onClick={() => setMenu("report a problem")}
              className={
                menu === "report a problem"
                  ? "bg-gray-50 text-black font-[500] cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
                  : "cursor-pointer hover:bg-gray-50 hover:text-black hover:font-[500] rounded pt-1 pb-1 pl-3 pr-3"
              }>
              report a problem
            </li>

            <li className="cursor-pointer font-[500] text-white bg-blue-500 hover:bg-blue-600 rounded pt-1 pb-1 pl-3 pr-3">
              PUBLISH
            </li>
          </ul>
        </nav>
        <ul className="flex justify-end items-center gap-3">
          <div className="flex flex-col items-end justify-center">
            <h2 className="text-[12px] leading-3">Chahat Kesharwani</h2>
            <h3 className="text-[10px]">{username}</h3>
          </div>
          <a href="">
            <img width={32} src={assets.user_icon} alt="" />
          </a>
        </ul>
      </div>

      {/* Main Body */}
      <div>
        <aside></aside>
        <button
          onClick={logout}
          className="pl-3 pr-3 pt-1 pb-1 bg-blue-100 text-black mt-4 ml-16 shadow font-[500]">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
