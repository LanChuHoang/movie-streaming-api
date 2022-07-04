import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./header.scss";
import logo from "../../assets/tmovie.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
// import { faarrowright } from "@fortawesome/free-regular-svg-icons";

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
  const logout = useLogout();
  const navigator = useNavigate();

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

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigator("/");
  };

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
          <li key={3} className="profile">
            {user?.username}
            <FontAwesomeIcon icon={faCaretDown} />
            <ul className="dropdown-menu">
              <li>
                <Link to="/logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  Logout
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
