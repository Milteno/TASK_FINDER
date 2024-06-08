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
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  useEffect(() => {
    if (!user.token) {
      navigate("/login");
    } else if (data) {
      setEmail(data.email);
      setUsername(data.username);
    }
  }, [user.token, data, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await updateUser({ email, password, username }).unwrap();
    dispatch(loginSuccess({ token: user.token, username: response.username }));
    setIsEditingEmail(false);
    setIsEditingPassword(false);
    setIsEditingUsername(false);
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
