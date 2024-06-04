import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/features/userSlice/userSlice";
import { useLoginUserMutation } from "../../redux/features/apiSlice/apiSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password }).unwrap();
      console.log("Login response:", response);
      dispatch(
        loginSuccess({
          token: response.token,
          username: response.user.username,
        })
      );
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.user.username);
      navigate("/home");
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
