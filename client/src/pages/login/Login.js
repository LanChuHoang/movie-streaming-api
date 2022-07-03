import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { useState, useRef, useEffect } from "react";
import backendApi from "../../api/backendApi";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.scss";

export default function Login() {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const emailInputRef = useRef();
  const buttonRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const lastPagePath = location.state?.from?.pathname || "/";
  const message = {
    MISSING_EMAIL_PASSWORD: "Missing email or password",
    WRONG_EMAIL_PASSWORD: "Wrong email or password, please try again!",
    NO_SERVER_RESPONSE: "No server response",
    LOGIN_FAILED: "Login failed",
  };

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    buttonRef.current.blur();

    try {
      console.log(email, password);
      const response = await backendApi.loginUser(email, password);
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
      setErrorMessage(null);
      setEmail("");
      setPassword("");
      navigate(lastPagePath, { replace: true });
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        setErrorMessage(message.NO_SERVER_RESPONSE);
        return;
      }
      switch (error.response.status) {
        case 400:
          setErrorMessage(message.MISSING_EMAIL_PASSWORD);
          break;
        case 401:
          setErrorMessage(message.WRONG_EMAIL_PASSWORD);
          break;
        default:
          setErrorMessage(
            message.LOGIN_FAILED + " with status " + error.response.status
          );
          break;
      }
    }
  };

  const invalidIcon = (
    <span className="icon">
      <FontAwesomeIcon
        icon={faTimesCircle}
        className={
          errorMessage === message.WRONG_EMAIL_PASSWORD
            ? "invalid-icon"
            : "hidden"
        }
      />
    </span>
  );

  return (
    <div className="login-container">
      <div className="top-container">
        <img
          className="logo"
          src="https://download.logo.wine/logo/CuriosityStream/CuriosityStream-Logo.wine.png"
          alt=""
        />
      </div>
      <div className="body-container">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>

          <label>Email</label>
          <div className="input-container">
            <input
              ref={emailInputRef}
              type="email"
              className={
                errorMessage === message.WRONG_EMAIL_PASSWORD
                  ? "invalid-input"
                  : ""
              }
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
            ></input>
            {invalidIcon}
          </div>

          <label>Password</label>
          <div className="input-container">
            <input
              type="password"
              className={
                errorMessage === message.WRONG_EMAIL_PASSWORD
                  ? "invalid-input"
                  : ""
              }
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
            ></input>
            {invalidIcon}
          </div>

          <p className={errorMessage ? "error-message" : "hidden"}>
            {errorMessage}
          </p>

          <button ref={buttonRef} className="signin-button">
            Sign in
          </button>

          <p>
            Not a member?
            <Link to="/register" className="signup-link">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
