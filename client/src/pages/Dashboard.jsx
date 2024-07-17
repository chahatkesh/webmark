import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import Loader from "../components/Loader";
import { assets } from "../assets/assests";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
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
      <div className="bg-white md:pl-10 md:pr-10 pl-6 h-[4rem] flex justify-between items-center">
        <div className="flex items-center">
          <a className="inline-flex" href="">
            <img width={28} src={assets.small_logo_color} alt="" />
          </a>
          <p className="pl-4 text-[14px] md:text-[18px]">
            Welcome{" "}
            <span className="font-[600] italic text-gray-500 text-[14px] md:text-[18px]">
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
        <div className="w-auto">
          <div className="flex justify-center">
            <div className="relative inline-block">
              <button
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center justify-center gap-2 rounded bg-white px-3 py-2 hover:bg-gray-50">
                <h3 className="text-[12px] md:text-[14px]">{username}</h3>
                <img className="w-5" src={assets.user_icon} alt="" />
                <span
                  className={`duration-100 ${
                    dropdownOpen ? "-scale-y-100" : ""
                  }`}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4062 5.65625 17.6875 5.9375C17.9688 6.21875 17.9688 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1562 10.1875 14.25 10 14.25Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </button>
              <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 top-full w-[240px] divide-y divide-stroke overflow-hidden rounded-lg bg-white ${
                  dropdownOpen ? "block" : "hidden"
                }`}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="relative aspect-square w-10 rounded-full">
                    <img
                      src={assets.user_icon}
                      alt="account"
                      className="w-full rounded-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold ">{username}</p>
                    <p className="text-sm text-body-color ">{useremail}</p>
                  </div>
                </div>
                <div>
                  <a
                    href="#0"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8 7C6.125 7 4.625 5.525 4.625 3.725C4.625 1.925 6.125 0.449997 8 0.449997C9.875 0.449997 11.375 1.925 11.375 3.725C11.375 5.525 9.875 7 8 7ZM8 1.575C6.75 1.575 5.75 2.55 5.75 3.725C5.75 4.9 6.75 5.875 8 5.875C9.25 5.875 10.25 4.9 10.25 3.725C10.25 2.55 9.25 1.575 8 1.575Z"
                          fill="currentColor"
                        />
                        <path
                          d="M13.275 15.575C12.975 15.575 12.7 15.325 12.7 15V14.275C12.7 11.675 10.6 9.575 8.00003 9.575C5.40002 9.575 3.30002 11.675 3.30002 14.275V15C3.30002 15.3 3.05002 15.575 2.72502 15.575C2.40002 15.575 2.15002 15.325 2.15002 15V14.275C2.15002 11.05 4.77502 8.45 7.97502 8.45C11.175 8.45 13.8 11.075 13.8 14.275V15C13.825 15.3 13.575 15.575 13.275 15.575Z"
                          fill="currentColor"
                        />
                      </svg>
                      View profile
                    </span>
                  </a>
                  <a
                    href="#0"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-50 ">
                    <span className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2453_19971)">
                          <path
                            d="M15.175 6.45C14.925 6.175 14.575 6.025 14.2 6.025H14.125C14 6.025 13.9 5.95 13.875 5.85C13.85 5.75 13.8 5.675 13.775 5.575C13.725 5.475 13.775 5.375 13.85 5.3L13.9 5.25C14.175 5 14.325 4.65 14.325 4.275C14.325 3.9 14.2 3.55 13.925 3.275L12.95 2.275C12.425 1.725 11.525 1.7 10.975 2.25L10.9 2.3C10.825 2.375 10.7 2.4 10.575 2.35C10.475 2.3 10.375 2.25 10.25 2.225C10.125 2.175 10.05 2.075 10.05 1.975V1.85C10.05 1.075 9.42504 0.449997 8.65004 0.449997H7.25004C6.87504 0.449997 6.52504 0.599997 6.27504 0.849997C6.00004 1.125 5.87504 1.475 5.87504 1.825V1.925C5.87504 2.025 5.80004 2.125 5.70004 2.175C5.65004 2.2 5.62504 2.2 5.57504 2.225C5.47504 2.275 5.35004 2.25 5.27504 2.175L5.22504 2.1C4.97504 1.825 4.62504 1.675 4.25004 1.675C3.87504 1.675 3.52504 1.8 3.25004 2.075L2.25004 3.05C1.70004 3.575 1.67504 4.475 2.22504 5.025L2.27504 5.1C2.35004 5.175 2.37504 5.3 2.32504 5.375C2.27504 5.475 2.25004 5.55 2.20004 5.65C2.15004 5.75 2.07504 5.8 1.95004 5.8H1.87504C1.50004 5.8 1.15004 5.925 0.875041 6.2C0.600041 6.45 0.450041 6.8 0.450041 7.175L0.425041 8.575C0.400041 9.35 1.02504 9.975 1.80004 10H1.87504C2.00004 10 2.10004 10.075 2.12504 10.175C2.17504 10.25 2.22504 10.325 2.25004 10.425C2.27504 10.525 2.25004 10.625 2.17504 10.7L2.12504 10.75C1.85004 11 1.70004 11.35 1.70004 11.725C1.70004 12.1 1.82504 12.45 2.10004 12.725L3.07504 13.725C3.60004 14.275 4.50004 14.3 5.05004 13.75L5.12504 13.7C5.20004 13.625 5.32504 13.6 5.45004 13.65C5.55004 13.7 5.65004 13.75 5.77504 13.775C5.90004 13.825 5.97504 13.925 5.97504 14.025V14.125C5.97504 14.9 6.60004 15.525 7.37504 15.525H8.77504C9.55004 15.525 10.175 14.9 10.175 14.125V14.025C10.175 13.925 10.25 13.825 10.35 13.775C10.4 13.75 10.425 13.75 10.475 13.725C10.6 13.675 10.7 13.7 10.775 13.775L10.825 13.85C11.075 14.125 11.425 14.275 11.8 14.275C12.175 14.275 12.525 14.15 12.8 13.875L13.8 12.9C14.35 12.375 14.375 11.475 13.825 10.925L13.775 10.85C13.7 10.775 13.675 10.65 13.725 10.575C13.775 10.475 13.8 10.4 13.85 10.3C13.9 10.2 14 10.15 14.1 10.15H14.175H14.2C14.95 10.15 15.575 9.55 15.6 8.775L15.625 7.375C15.575 7.075 15.425 6.7 15.175 6.45ZM14.425 8.8C14.425 8.95 14.3 9.075 14.15 9.075H14.075H14.05C13.475 9.075 12.95 9.425 12.75 9.925C12.725 10 12.675 10.075 12.65 10.15C12.425 10.65 12.525 11.275 12.925 11.675L12.975 11.75C13.075 11.85 13.075 12.025 12.975 12.125L11.975 13.1C11.9 13.175 11.825 13.175 11.775 13.175C11.725 13.175 11.65 13.175 11.575 13.1L11.525 13.025C11.125 12.6 10.525 12.475 9.97504 12.725L9.87504 12.775C9.32504 13 8.97504 13.5 8.97504 14.075V14.175C8.97504 14.325 8.85004 14.45 8.70004 14.45H7.30004C7.15004 14.45 7.02504 14.325 7.02504 14.175V14.075C7.02504 13.5 6.67504 12.975 6.12504 12.775C6.05004 12.75 5.95004 12.7 5.87504 12.675C5.67504 12.575 5.47504 12.55 5.27504 12.55C4.92504 12.55 4.57504 12.675 4.30004 12.95L4.25004 12.975C4.15004 13.075 3.97504 13.075 3.87504 12.975L2.90004 11.975C2.82504 11.9 2.82504 11.825 2.82504 11.775C2.82504 11.725 2.82504 11.65 2.90004 11.575L2.95004 11.525C3.37504 11.125 3.50004 10.5 3.27504 10C3.25004 9.925 3.22504 9.85 3.17504 9.775C2.97504 9.25 2.47504 8.875 1.90004 8.875H1.82504C1.67504 8.875 1.55004 8.75 1.55004 8.6L1.57504 7.2C1.57504 7.1 1.62504 7.05 1.65004 7C1.67504 6.975 1.75004 6.925 1.85004 6.925H1.92504C2.50004 6.95 3.02504 6.6 3.25004 6.075C3.27504 6 3.32504 5.925 3.35004 5.85C3.57504 5.35 3.47504 4.725 3.07504 4.325L3.02504 4.25C2.92504 4.15 2.92504 3.975 3.02504 3.875L4.02504 2.9C4.10004 2.825 4.17504 2.825 4.22504 2.825C4.27504 2.825 4.35004 2.825 4.42504 2.9L4.47504 2.975C4.87504 3.4 5.47504 3.525 6.02504 3.3L6.12504 3.25C6.67504 3.025 7.02504 2.525 7.02504 1.95V1.85C7.02504 1.75 7.07504 1.7 7.10004 1.65C7.12504 1.6 7.20004 1.575 7.30004 1.575H8.70004C8.85004 1.575 8.97504 1.7 8.97504 1.85V1.95C8.97504 2.525 9.32504 3.05 9.87504 3.25C9.95004 3.275 10.05 3.325 10.125 3.35C10.65 3.6 11.275 3.5 11.7 3.1L11.775 3.05C11.875 2.95 12.05 2.95 12.15 3.05L13.125 4.05C13.2 4.125 13.2 4.2 13.2 4.25C13.2 4.3 13.175 4.375 13.125 4.45L13.075 4.5C12.625 4.875 12.5 5.5 12.7 6C12.725 6.075 12.75 6.15 12.8 6.225C13 6.75 13.5 7.125 14.075 7.125H14.15C14.25 7.125 14.3 7.175 14.35 7.2C14.4 7.225 14.425 7.3 14.425 7.4V8.8Z"
                            fill="currentColor"
                          />
                          <path
                            d="M8.0001 4.59999C6.1251 4.59999 4.6001 6.12499 4.6001 7.99999C4.6001 9.87499 6.1251 11.4 8.0001 11.4C9.8751 11.4 11.4001 9.87499 11.4001 7.99999C11.4001 6.12499 9.8751 4.59999 8.0001 4.59999ZM8.0001 10.275C6.7501 10.275 5.7251 9.24999 5.7251 7.99999C5.7251 6.74999 6.7501 5.72499 8.0001 5.72499C9.2501 5.72499 10.2751 6.74999 10.2751 7.99999C10.2751 9.24999 9.2501 10.275 8.0001 10.275Z"
                            fill="currentColor"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2453_19971">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Settings
                    </span>
                  </a>
                  <a
                    href="#0"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 2.975H2.00005C1.15005 2.975 0.425049 3.675 0.425049 4.55V11.45C0.425049 12.3 1.12505 13.025 2.00005 13.025H14C14.85 13.025 15.575 12.325 15.575 11.45V4.55C15.575 3.675 14.85 2.975 14 2.975ZM14.45 11.45C14.45 11.7 14.25 11.9 14 11.9H2.00005C1.75005 11.9 1.55005 11.7 1.55005 11.45V4.55C1.55005 4.3 1.75005 4.1 2.00005 4.1H14C14.25 4.1 14.45 4.3 14.45 4.55V11.45Z"
                          fill="currentColor"
                        />
                        <path
                          d="M10.55 9.725H5.45C5.15 9.725 4.875 9.975 4.875 10.3C4.875 10.625 5.125 10.875 5.45 10.875H10.55C10.85 10.875 11.125 10.625 11.125 10.3C11.125 9.975 10.85 9.725 10.55 9.725Z"
                          fill="currentColor"
                        />
                        <path
                          d="M5.87505 6C5.87505 5.7 5.62505 5.425 5.30005 5.425H4.87505C4.57505 5.425 4.30005 5.675 4.30005 6C4.30005 6.325 4.55005 6.575 4.87505 6.575H5.30005C5.62505 6.575 5.87505 6.325 5.87505 6Z"
                          fill="currentColor"
                        />
                        <path
                          d="M7.77507 6.575H8.20007C8.50007 6.575 8.77507 6.325 8.77507 6C8.77507 5.675 8.52507 5.425 8.20007 5.425H7.77507C7.47507 5.425 7.20007 5.675 7.20007 6C7.20007 6.325 7.47507 6.575 7.77507 6.575Z"
                          fill="currentColor"
                        />
                        <path
                          d="M11.125 5.45H10.7C10.4 5.45 10.125 5.7 10.125 6.025C10.125 6.35 10.375 6.6 10.7 6.6H11.125C11.425 6.6 11.7 6.35 11.7 6.025C11.7 5.7 11.425 5.45 11.125 5.45Z"
                          fill="currentColor"
                        />
                        <path
                          d="M6.325 8.5H6.75C7.05 8.5 7.325 8.25 7.325 7.95C7.325 7.65 7.075 7.375 6.75 7.375H6.325C6.025 7.375 5.75 7.625 5.75 7.95C5.75 8.275 6.025 8.5 6.325 8.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M9.22503 8.5H9.65002C9.95002 8.5 10.225 8.25 10.225 7.95C10.225 7.65 9.97502 7.375 9.65002 7.375H9.22503C8.92503 7.375 8.65002 7.625 8.65002 7.95C8.65002 8.275 8.92503 8.5 9.22503 8.5Z"
                          fill="currentColor"
                        />
                      </svg>
                      Keyboard shortcuts
                    </span>
                    <span className="text-xs"> ⌘K </span>
                  </a>
                </div>
                <div>
                  <a
                    href="#0"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2453_19988)">
                          <path
                            d="M15.1 1.925L15.025 1.85C12.95 -0.0500008 9.79995 -0.0500008 7.72495 1.85L7.64995 1.925C7.52495 2.025 7.47495 2.175 7.47495 2.35V6.425H2.14995C1.34995 6.425 0.699951 7.075 0.699951 7.875V14.15C0.699951 14.95 1.34995 15.6 2.14995 15.6H13.65C14.55 15.6 15.275 14.875 15.275 13.975V2.35C15.3 2.175 15.225 2.025 15.1 1.925ZM1.82495 14.125V7.85C1.82495 7.675 1.97495 7.525 2.14995 7.525H7.44995V14.425H2.14995C1.97495 14.45 1.82495 14.3 1.82495 14.125ZM10.8 14.45V12.95C10.8 12.6 11.075 12.325 11.425 12.325C11.775 12.325 12.05 12.6 12.05 12.95V14.45H10.8ZM14.175 13.925C14.175 14.2 13.95 14.425 13.675 14.425H13.175V12.925C13.175 11.95 12.4 11.175 11.425 11.175C10.45 11.175 9.67495 11.95 9.67495 12.925V14.425H8.57495V6.975V2.6C10.2 1.225 12.55 1.225 14.175 2.6V13.925Z"
                            fill="currentColor"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2453_19988">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Company profile
                    </span>
                  </a>
                  <a
                    href="#0"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2404_1284)">
                          <path
                            d="M10.5499 7.425H8.5499V5.45C8.5499 5.15 8.2999 4.9 7.9749 4.9C7.6749 4.9 7.4249 5.15 7.4249 5.475V7.45H5.4499C5.1499 7.45 4.8999 7.7 4.8999 8.025C4.8999 8.325 5.1499 8.575 5.4749 8.575H7.4499V10.55C7.4499 10.85 7.6999 11.1 8.0249 11.1C8.3249 11.1 8.5749 10.85 8.5749 10.525V8.55H10.5499C10.8499 8.55 11.0999 8.3 11.0999 7.975C11.0999 7.675 10.8499 7.425 10.5499 7.425Z"
                            fill="currentColor"
                          />
                          <path
                            d="M7.99995 0.45C3.82495 0.45 0.449951 3.825 0.449951 8C0.449951 12.175 3.84995 15.575 8.02495 15.575C12.2 15.575 15.6 12.175 15.6 8C15.575 3.825 12.175 0.45 7.99995 0.45ZM7.99995 14.45C4.44995 14.45 1.57495 11.55 1.57495 8C1.57495 4.45 4.44995 1.575 7.99995 1.575C11.55 1.575 14.45 4.45 14.45 8C14.45 11.55 11.55 14.45 7.99995 14.45Z"
                            fill="currentColor"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2404_1284">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Menu Item
                    </span>
                  </a>
                  <a
                    href="#0"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2404_1284)">
                          <path
                            d="M10.5499 7.425H8.5499V5.45C8.5499 5.15 8.2999 4.9 7.9749 4.9C7.6749 4.9 7.4249 5.15 7.4249 5.475V7.45H5.4499C5.1499 7.45 4.8999 7.7 4.8999 8.025C4.8999 8.325 5.1499 8.575 5.4749 8.575H7.4499V10.55C7.4499 10.85 7.6999 11.1 8.0249 11.1C8.3249 11.1 8.5749 10.85 8.5749 10.525V8.55H10.5499C10.8499 8.55 11.0999 8.3 11.0999 7.975C11.0999 7.675 10.8499 7.425 10.5499 7.425Z"
                            fill="currentColor"
                          />
                          <path
                            d="M7.99995 0.45C3.82495 0.45 0.449951 3.825 0.449951 8C0.449951 12.175 3.84995 15.575 8.02495 15.575C12.2 15.575 15.6 12.175 15.6 8C15.575 3.825 12.175 0.45 7.99995 0.45ZM7.99995 14.45C4.44995 14.45 1.57495 11.55 1.57495 8C1.57495 4.45 4.44995 1.575 7.99995 1.575C11.55 1.575 14.45 4.45 14.45 8C14.45 11.55 11.55 14.45 7.99995 14.45Z"
                            fill="currentColor"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2404_1284">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Invite colleagues
                    </span>
                  </a>
                </div>
                <div>
                  <button
                    onClick={logout}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.3 0.449997H8.47502C7.82502 0.449997 7.27502 0.999997 7.27502 1.65V3.375C7.27502 3.675 7.52502 3.925 7.82502 3.925C8.12502 3.925 8.40002 3.675 8.40002 3.375V1.625C8.40002 1.575 8.42502 1.55 8.47502 1.55H11.3C11.9 1.55 12.375 2.025 12.375 2.625V13.35C12.375 13.95 11.9 14.425 11.3 14.425H8.47502C8.42502 14.425 8.40002 14.4 8.40002 14.35V12.625C8.40002 12.325 8.15002 12.075 7.82502 12.075C7.50002 12.075 7.27502 12.325 7.27502 12.625V14.35C7.27502 15 7.82502 15.55 8.47502 15.55H11.3C12.525 15.55 13.5 14.55 13.5 13.35V2.65C13.5 1.425 12.5 0.449997 11.3 0.449997Z"
                          fill="currentColor"
                        />
                        <path
                          d="M4.39998 8.55H8.87498C9.17498 8.55 9.42498 8.3 9.42498 8C9.42498 7.7 9.17498 7.45 8.87498 7.45H4.42498L5.97498 5.875C6.19998 5.65 6.19998 5.3 5.97498 5.075C5.74998 4.85 5.39998 4.85 5.17498 5.075L2.67498 7.625C2.44998 7.85 2.44998 8.2 2.67498 8.425L5.17498 10.975C5.27498 11.075 5.42498 11.15 5.57498 11.15C5.72498 11.15 5.84998 11.1 5.97498 11C6.19998 10.775 6.19998 10.425 5.97498 10.2L4.39998 8.55Z"
                          fill="currentColor"
                        />
                      </svg>
                      Log out
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div>
        <aside></aside>
      </div>
    </div>
  );
};

export default Dashboard;
