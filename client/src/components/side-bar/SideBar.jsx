import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
    subPath: "/admin/user",
    icon: faCircleUser,
  },
  {
    display: "Movies",
    path: "/admin/movies",
    subPath: "/admin/movie",
    icon: faFilm,
  },
  {
    display: "Shows",
    path: "/admin/shows",
    subPath: "/admin/show",
    icon: faTv,
  },
  {
    display: "People",
    path: "/admin/people",
    subPath: "/admin/person",
    icon: faPerson,
  },
];

function findSelectedIndex(path) {
  const index = sideBarItems.findIndex(
    (i) => i.path === path || path.startsWith(i.subPath)
  );
  return index !== -1 ? index : 0;
}

const SideBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setSelectedIndex(findSelectedIndex(location.pathname));
  }, [location]);

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
            selected={selectedIndex === 0}
          />

          <h2 className="group-header">Database</h2>
          {sideBarItems.slice(1).map((item, i) => (
            <SideBarItem
              key={item.display}
              item={item}
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
