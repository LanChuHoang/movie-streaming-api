import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { useState, useRef, useEffect } from "react";
import backendApi from "../../api/backendApi";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.scss";
import AuthHeader from "../../components/headers/auth-header/AuthHeader";
import useLogout from "../../hooks/useLogout";

export default function Login() {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const emailInputRef = useRef();
  const buttonRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const lastPagePath = location.state?.from?.pathname || "/";

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    buttonRef.current.blur();

    try {
      const response = await backendApi.loginUser(email, password);
      if (!response.data.isAdmin) {
        await logout();
        setErrorMessage(MESSAGE.PERMISSON_DENINED);
        return;
      }
      const userData = {
        id: response.data._id,
        isAdmin: response.data.isAdmin,
        accessToken: response.data.accessToken,
      };
      setAuth(userData);
      navigate(lastPagePath, { replace: true });
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        setErrorMessage(MESSAGE.NO_SERVER_RESPONSE);
        return;
      }
      switch (error.response.status) {
        case 400:
          setErrorMessage(MESSAGE.MISSING_EMAIL_PASSWORD);
          break;
        case 401:
          setErrorMessage(MESSAGE.WRONG_EMAIL_PASSWORD);
          break;
        default:
          setErrorMessage(
            MESSAGE.LOGIN_FAILED + " with status " + error.response.status
          );
          break;
      }
    }
  };

  return (
    <div className="login-container">
      <AuthHeader />
      <div className="body-container">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <label>Email</label>
          <div className="input-container">
            <input
              ref={emailInputRef}
              type="email"
              className={isInvalidInput(errorMessage) ? "invalid-input" : ""}
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
            />
            <InvalidIcon display={isInvalidInput(errorMessage)} />
          </div>
          <label>Password</label>
          <div className="input-container">
            <input
              type="password"
              className={isInvalidInput(errorMessage) ? "invalid-input" : ""}
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
            />
            <InvalidIcon display={isInvalidInput(errorMessage)} />
          </div>
          <p className={errorMessage ? "error-message" : "hidden"}>
            {errorMessage}
          </p>
          <button ref={buttonRef} className="signin-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

const InvalidIcon = ({ display }) => (
  <span className="icon">
    <FontAwesomeIcon
      icon={faTimesCircle}
      className={display ? "invalid-icon" : "hidden"}
    />
  </span>
);

const MESSAGE = {
  MISSING_EMAIL_PASSWORD: "Missing email or password",
  WRONG_EMAIL_PASSWORD: "Wrong email or password, please try again!",
  PERMISSON_DENINED: "Permission denined",
  NO_SERVER_RESPONSE: "No server response",
  LOGIN_FAILED: "Login failed",
};

const isInvalidInput = (message) =>
  message === MESSAGE.WRONG_EMAIL_PASSWORD ||
  message === MESSAGE.MISSING_EMAIL_PASSWORD;
