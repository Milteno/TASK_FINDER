import React, { useState } from "react";
import { useRegisterUserMutation } from "../../redux/features/apiSlice/apiSlice";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/features/userSlice/userSlice";
import classes from "./registerPage.module.scss";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerUser] = useRegisterUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password))
      newErrors.password =
        "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one number";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await registerUser({
          username,
          email,
          password,
        }).unwrap();
        dispatch(loginSuccess(response));
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.user.username);
        navigate("/map");
        window.location.reload();
      } catch (error: any) {
        if (error.data && error.data.message) {
          setErrors({ server: error.data.message });
        }
      }
    }
  };

  return (
    <div className={classes.registerPageWrapper}>
      <form onSubmit={handleSubmit} className={classes.registerForm}>
        <h2>Rejestracja</h2>
        <div className={classes.inputGroup}>
          <label>Nazwa Użytkownika</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="wpisz nazwę użytkownika"
          />
          {errors.username && (
            <p className={classes.error}>{errors.username}</p>
          )}
        </div>
        <div className={classes.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="wpisz email"
          />
          {errors.email && <p className={classes.error}>{errors.email}</p>}
        </div>
        <div className={classes.inputGroup}>
          <label>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="wpisz hasło"
          />
          {errors.password && (
            <p className={classes.error}>{errors.password}</p>
          )}
        </div>
        <div className={classes.inputGroup}>
          <label>Potwierdź hasło</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="wpisz hasło"
          />
          {errors.confirmPassword && (
            <p className={classes.error}>{errors.confirmPassword}</p>
          )}
        </div>
        {errors.server && <p className={classes.error}>{errors.server}</p>}
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
};

export default RegisterPage;
