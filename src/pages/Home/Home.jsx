import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-container ">
      <Sidebar />
      <div className="home">
        <Navbar />
        <div className="home-page page-container">home page</div>
      </div>
    </div>
  );
};

export default Home;
