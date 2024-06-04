import React, { useState } from "react";
import { useRegisterUserMutation } from "../../redux/features/apiSlice/apiSlice";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/features/userSlice/userSlice";
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser] = useRegisterUserMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser({
        username,
        email,
        password,
      }).unwrap();
      dispatch(loginSuccess(response));
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.user.username);
    } catch (error) {
      console.error("Failed to register", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
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
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
