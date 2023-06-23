import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [erroMessage, setErrorMessage] = useState('')

  const history = useHistory();

  const onLoginClicked = async () => {
    alert("login button clicked");
  };

  return (
    <div className="content-container">
      <h1>Login</h1>
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
      <button disabled={!emailValue || !passwordValue} onClick={onLoginClicked}>
        Login
      </button>
      <hr/>
      <button onClick={() => history.push("/forget-password")}>
        Forget Password?
      </button>
      <button onClick={() => history.push("/signup")}>Sign up</button>
    </div>
  );
};

export default LoginPage;
