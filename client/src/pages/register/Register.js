import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import "./Register.scss";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import backendApi from "../../api/backendApi";

function Register() {
  const USERNAME_REGEX = /^[a-zA-Z0-9]{6,14}$/;
  const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const PASSWORD_REGEX = /^[^\s]{8,}$/;
  const message = {
    username: "must contains letters or numbers, 6-14 characters",
    email: "invalid email address",
    password: "must have at least 8 characters, no spaces",
    NO_SERVER_RESPONSE: "No server response",
    INVALID_REGISTER_FIELDS: "Invalid fields, please check again",
    DUPLICATE_USER: "Duplicate username or email",
  };
  const placeHolder = {
    username: "6-14 alphanumberic characters ",
    email: "your-email@domain.com",
    password: "at least 8 characters, no spaces",
  };

  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isValidName, setIsValidName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, email, password);

    const isAllValid = () =>
      USERNAME_REGEX.test(username) &&
      EMAIL_REGEX.test(email) &&
      PASSWORD_REGEX.test(password);
    if (!isAllValid()) {
      setErrorMessage(message.INVALID_REGISTER_FIELDS);
      return;
    }

    // Send request to server
    try {
      const response = await backendApi.registerUser(username, email, password);
      console.log(response.data);

      const userData = {
        _id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        profileImage: response.data.profileImage,
        isAdmin: response.data.isAdmin,
        accessToken: response.data.accessToken,
      };
      setAuth(userData);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        setErrorMessage(message.NO_SERVER_RESPONSE);
        return;
      }
      switch (error.response.status) {
        case 400:
          setErrorMessage(message.INVALID_REGISTER_FIELDS);
          break;
        case 409:
          setErrorMessage(message.DUPLICATE_USER);
          break;
        default:
          setErrorMessage(
            message.LOGIN_FAILED + " with status " + error.response.status
          );
          break;
      }
    }
  };

  const createValidationIcon = (isValid) => {
    return isValid ? (
      <span className={"icon"}>
        <FontAwesomeIcon icon={faCheckCircle} className={"valid-icon"} />
      </span>
    ) : (
      <span className={"icon"}>
        <FontAwesomeIcon icon={faTimesCircle} className={"invalid-icon"} />
      </span>
    );
  };

  const validationInputClass = (isValid) =>
    isValid ? "valid-input" : "invalid-input";

  return (
    <div className="register-container">
      <div className="top-container">
        <img
          className="logo"
          src="https://download.logo.wine/logo/CuriosityStream/CuriosityStream-Logo.wine.png"
          alt=""
        />
      </div>
      <div className="body-container">
        <form onSubmit={handleSubmit}>
          <h1>Create your account</h1>

          <label>
            Username
            <span className="err-mess">
              {!username || isValidName ? "" : message.username}
            </span>
          </label>
          <div className="input-container">
            <input
              type="text"
              className={!username ? "" : validationInputClass(isValidName)}
              placeholder={placeHolder.username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsValidName(USERNAME_REGEX.test(e.target.value));
                setErrorMessage(null);
              }}
            ></input>
            {!username ? "" : createValidationIcon(isValidName)}
          </div>

          <label>
            Email
            <span className="err-mess">
              {!email || isValidEmail ? "" : message.email}
            </span>
          </label>
          <div className="input-container">
            <input
              type="email"
              className={!email ? "" : validationInputClass(isValidEmail)}
              placeholder={placeHolder.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsValidEmail(EMAIL_REGEX.test(e.target.value));
                setErrorMessage(null);
              }}
            ></input>
            {!email ? "" : createValidationIcon(isValidEmail)}
          </div>

          <label>
            Password
            <span className="err-mess">
              {!password || isValidPassword ? "" : message.password}
            </span>
          </label>
          <div className="input-container">
            <input
              type="password"
              className={!password ? "" : validationInputClass(isValidPassword)}
              placeholder={placeHolder.password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsValidPassword(PASSWORD_REGEX.test(e.target.value));
                setErrorMessage(null);
              }}
            ></input>
            {!password ? "" : createValidationIcon(isValidPassword)}
          </div>

          <p>{errorMessage}</p>

          <button
            disabled={!isValidName || !isValidEmail || !isValidPassword}
            className="signup-button"
          >
            Sign Up
          </button>

          <p>
            Already have an account?
            <Link className=".signin-link" to="/login">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
