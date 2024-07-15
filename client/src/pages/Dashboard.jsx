import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";

const Dashboard = () => {
  const { url, token, setToken } = useContext(StoreContext);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
    navigate("/auth");
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.post(
        url + "/api/user/userdata",
        { userId: "someUserId" }, // Adjust this line to pass the correct userId
        { headers: { token } }
      );
      const fetchedUsername = response.data.username;
      setUsername(fetchedUsername);
      localStorage.setItem("username", fetchedUsername);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (!username) {
      fetchUserData();
    }
  }, [username]);

  return (
    <div>
      <p>Dashboard</p>
      <button onClick={logout}>Logout</button>
      <p>Hi {username}</p>
    </div>
  );
};

export default Dashboard;
