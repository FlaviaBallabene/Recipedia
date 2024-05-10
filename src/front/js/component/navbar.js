import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChatBot } from "./chatbot";
import recipedia from "../../img/recipedia.png";
import "../../styles/home.css";
import { Context } from "../store/appContext";

export const Navbar = ({ setOrigin }) => {
  const [showChatBot, setShowChatBot] = useState(false);
  const navigate = useNavigate();
  console.log(useNavigate);
  const { store, actions } = useContext(Context);

  return (
    <nav
      className="navbar navbarCustom d-flex"
      style={{
        width: "90%",
        marginBottom: "-30px",
        fontFamily: "avenir-light",
        color: "#303131",
      }}
    >
      <div
        className="navbar navbarCustom col-12"
        style={{ justifyContent: "center" }}
      >
        {" "}
        <Link to="/">
          <img
            src={recipedia}
            style={{ width: "250px", height: "auto", marginLeft: "-110px" }}
            alt="recipedia"
          />
        </Link>
      </div>
      <div className="ml-auto d-flex justify-content-start">
        <span className="navbar navbarCustom m-5">Filters</span>
        <span
          className="navbar navbarCustom"
          onClick={() => setShowChatBot(!showChatBot)}
        >
          Chatbot
        </span>
      </div>
      <div className="ml-auto me-3">
        {store.logged ? (
          <button className="navbar navbarCustom" style={{ border: "none", background: "transparent",}} onClick={actions.logout}>
              Logout
          </button>
          ) : (
          <Link style={{ textDecoration: "none", outline: "none" }} to="/login">
          <button
            className="navbar navbarCustom"
            style={{ border: "none", background: "transparent", }}
          >
            Login
          </button>
          </Link>
        )}
      </div>
      <div className="chatbot col-12" style={{ marginTop: "-40px",}}>
        {showChatBot && (
          <ChatBot setShowChatBot={setShowChatBot} setOrigin={setOrigin} />
        )}
      </div>
    </nav>
  );
};