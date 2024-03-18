import React from "react";
import "./ChangePassword.scss";
import img from "../../assest/img3.png";
import image from "../../assest/Img1.png";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { GW_URL } from "../../config";
import Loader from "../../components/Loader/Loader";
const Login = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [usernameError, setUserIdError] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [reEnteredPasswordError, setReEnteredPasswordError] = useState(true);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [username, setUserId] = useState("");
  const navigate = useNavigate();

  const changePasswordHandler = (e) => {
    e.preventDefault();
    if (username == "") setUserIdError(true);
    if (currentPassword == "") setCurrentPasswordError(true);
    if (newPassword == "") setNewPasswordError(true);
    if (username && currentPassword && newPassword && reEnteredPassword) {
      if (newPassword === reEnteredPassword) {
        // api call
        setLoaderOpen(true);
        axios
          .put(`${GW_URL}/user/changePassword`, {
            username: username,
            oldPassword: currentPassword,
            newPassword: newPassword,
          })
          .then((data) => {
            setLoaderOpen(false);
            setTimeout(() => {
              toast.success(data.data.message, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }, 1000);

            navigate("/");
          })
          .catch((err) => {
            console.log(err);
            setLoaderOpen(false);
            toast.error("Old password is wrong", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      } else {
        toast.error("Both Password are diffent", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      toast.warn("All Fileds are Required", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    setCurrentPassword("");
    setNewPassword("");
    setReEnteredPassword("");
    setUserId("");
  };
  return (
    <div>
      <div className="changePassword-container">
        <div className="main-container">
          <div className="left-container">
            <div className="content-box">
              <div className="logo">
                <img className="photo" src={img}></img>
              </div>
            </div>
          </div>
          <div className="right-container">
            <div className="headerImage">
              <div>
                <img src={image}></img>
              </div>
              <div>
                <span>GW Techies</span>
              </div>
            </div>
            <form onSubmit={changePasswordHandler}>
              <div className="input-login-container">
                <label>Username</label>
                <input
                  value={username}
                  type="number"
                  placeholder="Username..."
                  onChange={(e) => setUserId(e.target.value)}
                ></input>
              </div>
              <div className="input-login-container">
                <label>Current Password</label>
                <input
                  value={currentPassword}
                  type="password"
                  placeholder="enter current Password..."
                  onChange={(e) => setCurrentPassword(e.target.value)}
                ></input>
              </div>
              <div className="input-login-container">
                <label>New Password</label>
                <input
                  type="text"
                  value={newPassword}
                  placeholder="New password"
                  onChange={(e) => setNewPassword(e.target.value)}
                ></input>
              </div>
              <div
                className={
                  reEnteredPasswordError
                    ? "input-login-container-error input-login-container"
                    : "input-login-container"
                }
              >
                <label>Confirm Password</label>
                <input
                  className="input-container-error"
                  value={reEnteredPassword}
                  type="password"
                  placeholder="Re enter Password"
                  onChange={(e) => setReEnteredPassword(e.target.value)}
                ></input>
              </div>
              <div className="button-container">
                <button type="submit" style={{ textDecorationLine: "none" }}>
                  Change Password
                </button>
                <div className="forgotpassword"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Loader open={loaderOpen} />
    </div>
  );
};

export default Login;
