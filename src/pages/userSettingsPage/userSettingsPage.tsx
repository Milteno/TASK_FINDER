import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useUpdateUserMutation,
  useGetUserQuery,
} from "../../redux/features/apiSlice/apiSlice";
import { loginSuccess } from "../../redux/features/userSlice/userSlice";
import CityNameAutoComplete from "../../components/cityNameAutoComplete/cityNameAutoComplete";
import classes from "./userSettingsPage.module.scss";

const UserSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const { data, error, isLoading } = useGetUserQuery(undefined, {
    skip: !user.token,
  });
  const [updateUser, { isLoading: isUpdating, error: updateError }] =
    useUpdateUserMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user.token) {
      navigate("/login");
    } else if (data) {
      setEmail(data.email);
      setUsername(data.username);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setCity(data.city || "");
    }
  }, [user.token, data, navigate]);

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

    if (password && !validatePassword(password))
      newErrors.password =
        "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one number";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await updateUser({
          email,
          password,
          username,
          firstName,
          lastName,
          city,
        }).unwrap();
        dispatch(
          loginSuccess({
            token: user.token,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            city: response.city,
          })
        );
        setIsEditingEmail(false);
        setIsEditingPassword(false);
        setIsEditingUsername(false);
        setIsEditingFirstName(false);
        setIsEditingLastName(false);
        setIsEditingCity(false);
      } catch (error: any) {
        if (error.data && error.data.message) {
          setErrors({ server: error.data.message });
        }
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={classes.userSettingsPageWrapper}>
      <div className={classes.userSettingsPageContent}>
        <h2>Ustawienia użytkownika {user.username}</h2>
        <form onSubmit={handleSubmit}>
          <div className={classes.inputGroup}>
            <label>Nazwa Użytkownika</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditingUsername}
            />
            <button
              type="button"
              onClick={() => setIsEditingUsername(!isEditingUsername)}
            >
              {isEditingUsername ? "Anuluj" : "Zmień"}
            </button>
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
              disabled={!isEditingEmail}
            />
            <button
              type="button"
              onClick={() => setIsEditingEmail(!isEditingEmail)}
            >
              {isEditingEmail ? "Anuluj" : "Zmień"}
            </button>
            {errors.email && <p className={classes.error}>{errors.email}</p>}
          </div>
          <div className={classes.inputGroup}>
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Update password"
              disabled={!isEditingPassword}
            />
            <button
              type="button"
              onClick={() => setIsEditingPassword(!isEditingPassword)}
            >
              {isEditingPassword ? "Anuluj" : "Zmień"}
            </button>
            {errors.password && (
              <p className={classes.error}>{errors.password}</p>
            )}
          </div>
          <div className={classes.inputGroup}>
            <label>Imię</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditingFirstName}
            />
            <button
              type="button"
              onClick={() => setIsEditingFirstName(!isEditingFirstName)}
            >
              {isEditingFirstName ? "Anuluj" : "Zmień"}
            </button>
          </div>
          <div className={classes.inputGroup}>
            <label>Nazwisko</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditingLastName}
            />
            <button
              type="button"
              onClick={() => setIsEditingLastName(!isEditingLastName)}
            >
              {isEditingLastName ? "Anuluj" : "Zmień"}
            </button>
          </div>
          <div className={classes.inputGroup}>
            <CityNameAutoComplete
              value={city}
              onChange={setCity}
              label="Miasto"
              disabled={!isEditingCity}
            />
            <button
              type="button"
              onClick={() => setIsEditingCity(!isEditingCity)}
            >
              {isEditingCity ? "Anuluj" : "Zmień"}
            </button>
          </div>
          <button type="submit" disabled={isUpdating}>
            Aktualizuj
          </button>
          {(error || updateError) && (
            <p className={classes.error}>
              {error?.toString() || updateError?.toString()}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserSettingsPage;
