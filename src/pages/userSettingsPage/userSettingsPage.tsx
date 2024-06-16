import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useUpdateUserMutation,
  useGetUserQuery,
} from "../../redux/features/apiSlice/apiSlice";
import { loginSuccess } from "../../redux/features/userSlice/userSlice";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        username: response.user.username,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        city: response.user.city,
      })
    );
    setIsEditingEmail(false);
    setIsEditingPassword(false);
    setIsEditingUsername(false);
    setIsEditingFirstName(false);
    setIsEditingLastName(false);
    setIsEditingCity(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={classes.userSettingsPageWrapper}>
      <div className={classes.userSettingsPageContent}>
        <h2>User Settings for {user.username}</h2>
        <form onSubmit={handleSubmit}>
          <div className={classes.inputGroup}>
            <label>Username</label>
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
              {isEditingUsername ? "Cancel" : "Change"}
            </button>
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
              {isEditingEmail ? "Cancel" : "Change"}
            </button>
          </div>
          <div className={classes.inputGroup}>
            <label>Password</label>
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
              {isEditingPassword ? "Cancel" : "Change"}
            </button>
          </div>
          <div className={classes.inputGroup}>
            <label>First Name</label>
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
              {isEditingFirstName ? "Cancel" : "Change"}
            </button>
          </div>
          <div className={classes.inputGroup}>
            <label>Last Name</label>
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
              {isEditingLastName ? "Cancel" : "Change"}
            </button>
          </div>
          <div className={classes.inputGroup}>
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!isEditingCity}
            />
            <button
              type="button"
              onClick={() => setIsEditingCity(!isEditingCity)}
            >
              {isEditingCity ? "Cancel" : "Change"}
            </button>
          </div>
          <button type="submit" disabled={isUpdating}>
            Update
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
