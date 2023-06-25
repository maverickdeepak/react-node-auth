import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useToken } from "../auth/useToken";
import axios from 'axios'

const SignUpPage = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [erroMessage, setErrorMessage] = useState("");
  const [token, setToken] = useToken()

  const history = useHistory();

  const onSignUpClicked = async () => {
    const response = await axios.post('/api/signup', {
      email: emailValue,
      password: passwordValue
    });
    const token = response.data.token;
    setToken(token)
    history.push('/')
  };

  return (
    <div className="content-container">
      <h1>Sign Up</h1>
      {erroMessage && <div className="fail">{setErrorMessage}</div>}
      <input
        type="email"
        placeholder="example@example.com"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <input
        type="passowrd"
        placeholder="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <input
        type="passowrd"
        placeholder="password"
        value={confirmPasswordValue}
        onChange={(e) => setConfirmPasswordValue(e.target.value)}
      />
      <button
        disabled={
          !emailValue ||
          !passwordValue ||
          passwordValue !== confirmPasswordValue
        }
        onClick={onSignUpClicked}
      >
        Sign Up
      </button>
      <hr />
      <button onClick={() => history.push("/forget-password")}>
        Forget Password?
      </button>
      <button onClick={() => history.push("/login")}>Login</button>
    </div>
  );
};

export default SignUpPage;
