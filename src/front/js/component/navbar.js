import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChatBot } from "./chatbot";
import { FilterCard } from "./filternavbar"
import recipedia from "../../img/recipedia.png";
import "../../styles/home.css";
import "../../styles/filternavbar.css";
import { Context } from "../store/appContext";

export const Navbar = ({ setOrigin }) => {
  const [showChatBot, setShowChatBot] = useState(false);
  const navigate = useNavigate();
  console.log(useNavigate);
  const { store, actions } = useContext(Context);
  const [showFilterCard, setShowFilterCard] = useState(false);

  const toggleFilterCard = () => {
    setShowFilterCard(!showFilterCard);
};

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

        <button className="navbar filters-button" type="button" onClick={toggleFilterCard}>Filters</button>
        {showFilterCard && 
          <div className="col">
            <FilterCard />
          </div>
        }

        <span
          className="navbar navbarCustom"
          onClick={() => setShowChatBot(!showChatBot)}
        >
          Chatbot
        </span>
      </div>
      <div className="ml-auto me-3" style={{fontFamily: "avenir-light", color: "#303131",}}>
        {store.logged ? (
          <div className="dropdown">
          <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none", background: "transparent", fontSize:"22px"}}>
            My Profile
          </button>
          <ul className="dropdown-menu ps-2" style={{fontSize:"18px", width:"200px"}}>
          <li className="dropdown-element pb-2"><Link style={{ textDecoration: "none", outline: "none", color:"black"}} to="/favourites">Favourites</Link></li>
          <li className="dropdown-element pb-2"><Link style={{ textDecoration: "none", outline: "none", color:"black"}} to="/manageaccount">Manage my Account</Link></li>
          <li className="dropdown-element"><a type="button" onClick={actions.logout}> Logout</a></li>
          {/* <button className="navbar navbarCustom" style={{ border: "none", background: "transparent",}} onClick={actions.logout}>
              Logout
          </button> */}
          </ul>
        </div>
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