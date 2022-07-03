import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useBackendApi from "../../hooks/useBackendApi";
import "./header.scss";
import logo from "../../assets/tmovie.png";

const headerNav = [
  {
    display: "Home",
    path: "/",
  },
  {
    display: "Movies",
    path: "/movie",
  },
  {
    display: "Shows",
    path: "/show",
  },
];

const Header = () => {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const { auth } = useAuth();
  const [user, setUser] = useState();
  // const backendApi = useBackendApi();

  const active = headerNav.findIndex((e) => e.path === pathname);

  useEffect(() => {
    const shrinkHeader = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }
    };
    window.addEventListener("scroll", shrinkHeader);
    return () => {
      window.removeEventListener("scroll", shrinkHeader);
    };
  }, []);

  useEffect(() => {
    const { accessToken, ...user } = auth;
    setUser(user);
  }, [auth]);

  return (
    <div ref={headerRef} className="header">
      <div className="header__wrap container">
        <div className="logo">
          <img src={logo} alt="" />
          <Link to="/">tMovies</Link>
        </div>
        <ul className="header__nav">
          {headerNav.map((e, i) => (
            <li key={i} className={`${i === active ? "active" : ""}`}>
              <Link to={e.path}>{e.display}</Link>
            </li>
          ))}
          <li key={3}>{user?.username}</li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
