import { Link } from "react-router-dom";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faFilm,
  faTv,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { faRectangleList } from "@fortawesome/free-regular-svg-icons";
import "./sideBar.scss";

const sideBarItems = [
  {
    display: "Dashboard",
    path: "/admin",
    icon: faRectangleList,
  },
  {
    display: "Users",
    path: "/admin/users",
    icon: faCircleUser,
  },
  {
    display: "Movies",
    path: "/admin/movies",
    icon: faFilm,
  },
  {
    display: "Shows",
    path: "/admin/shows",
    icon: faTv,
  },
  {
    display: "People",
    path: "/admin/people",
    icon: faPerson,
  },
];

const SideBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="sidebar-container">
      <div className="logo-section">
        <Link to="/">
          <span className="logo">tMovie</span>
        </Link>
      </div>
      <hr />
      <div className="main-section">
        <ul>
          <h2 className="group-header">Monitor</h2>
          <SideBarItem
            key={sideBarItems[0].display}
            item={sideBarItems[0]}
            onClick={() => setSelectedIndex(0)}
            selected={selectedIndex === 0}
          />

          <h2 className="group-header">Database</h2>
          {sideBarItems.slice(1).map((item, i) => (
            <SideBarItem
              key={item.display}
              item={item}
              onClick={() => setSelectedIndex(i + 1)}
              selected={selectedIndex === i + 1}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const SideBarItem = (props) => {
  return (
    <Link to={props.item.path}>
      <li className={props.selected ? "selected" : ""} onClick={props.onClick}>
        <FontAwesomeIcon icon={props.item.icon} />
        {props.item.display}
      </li>
    </Link>
  );
};

export default SideBar;
