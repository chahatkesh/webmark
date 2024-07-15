import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";

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

  return (
    <div>
      <p>Dashboard</p>
      <button onClick={logout}>Logout</button>
      <p>Hi {username || useremail || "User"}</p>
    </div>
  );
};

export default Dashboard;
