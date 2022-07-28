import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";
import useAuth from "../../../hooks/useAuth";
import useBackendApi from "../../../hooks/useBackendApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";
import "./adminHeader.scss";

const AdminHeader = () => {
  const [user, setUser] = useState();
  const { auth } = useAuth();
  const logout = useLogout();
  const navigator = useNavigate();
  const backendApi = useBackendApi();

  useEffect(() => {
    const fetchUserDetail = async (id) => {
      const { username, profileImage } = (await backendApi.getUserDetail(id))
        .data;
      setUser({ username, profileImage });
    };
    fetchUserDetail(auth?.id);
  }, [auth]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigator("/");
  };

  return (
    <div className="admin-header-container">
      <div className="profile">
        <img
          src={user?.profileImage || defaultAvatar}
          alt=""
          className="avatar"
        />
        <p>{user?.username}</p>
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default AdminHeader;
