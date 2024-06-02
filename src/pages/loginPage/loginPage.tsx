import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../redux/features/apiSlice/apiSlice";
import { loginSuccess } from "../../redux/features/userSlice/userSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginUserMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await login({ email, password });
      dispatch(loginSuccess(data));
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
