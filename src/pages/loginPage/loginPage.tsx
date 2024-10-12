import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/features/apiSlice/apiSlice";
import { loginSuccess } from "../../redux/features/userSlice/userSlice";
import classes from "./loginPage.module.scss";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password }).unwrap();
      dispatch(
        loginSuccess({
          token: response.token,
          username: response.user.username,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          city: response.user.city,
        })
      );
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.user.username);
      localStorage.setItem("email", response.user.email);
      localStorage.setItem("firstName", response.user.firstName);
      localStorage.setItem("lastName", response.user.lastName);
      localStorage.setItem("city", response.user.city);
      navigate("/map");
    } catch (err: any) {
      setError(err.data?.message || "Niepoprawny adres email lub hasło");
    }
  };

  return (
    <div className={classes.loginPageWrapper}>
      <div className={classes.loginPageContent}>
        <h2>Logowanie</h2>
        <form onSubmit={handleSubmit}>
          <div className={classes.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            Zaloguj
          </button>
          {error && <p className={classes.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
