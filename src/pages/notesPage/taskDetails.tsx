import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetTaskByIdQuery } from "../../redux/features/apiSlice/apiSlice";
import { useSelector } from "react-redux";
import SignupForm from "../../components/SignupForm/signupForm";
import classes from "./taskDetails.module.scss";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: task, error, isLoading } = useGetTaskByIdQuery(id);
  const [hasApplied, setHasApplied] = useState(false);
  const user = useSelector((state: any) => state.user);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfApplied = async () => {
      const response = await fetch(`http://localhost:5000/signup/check/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setHasApplied(result.hasApplied);
      }
    };

    if (user.token) {
      checkIfApplied();
    }
  }, [id, user.token]);

  const handleSignup = () => {
    setShowSignupForm(true);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSignupSuccess = () => {
    setHasApplied(true);
    setShowSignupForm(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading task details</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  const isOwner = task.userId.username === user.username;

  return (
    <div className={classes.taskDetailsWrapper}>
      {showSignupForm ? (
        <div className={classes.signupFormWrapper}>
          <SignupForm
            taskId={task._id}
            onCancel={() => setShowSignupForm(false)}
            onSuccess={handleSignupSuccess}
          />
        </div>
      ) : (
        <div className={classes.taskDetailsContent}>
          <h1>{task.title}</h1>
          <p>
            Data rozpoczęcia zlecenia:{" "}
            {new Date(task.date).toLocaleDateString()}
          </p>
          <p>Godzina rozpoczęcia zlecenia: {task.time}</p>
          <p>Lokalizacja: {task.location}</p>
          <p>Numer telefonu: {task.phoneNumber}</p>
          <p>Zakres obowiązków: {task.tasks}</p>
          <p>Czas wykonywania zlecenia: {task.duration}</p>
          <p>Informacje dodatkowe: {task.additionalInfo}</p>
          <p>Stawka godzinowa: PLN {task.hourlyRate}</p>
          <p>Opublikowane przez: {task.userId.username}</p>
          {!user.token ? (
            <button onClick={handleLoginRedirect}>Zaloguj się</button>
          ) : hasApplied ? (
            <button disabled>Już aplikowałeś</button>
          ) : isOwner ? (
            <button disabled>Nie możesz aplikować na własne ogłoszenie</button>
          ) : (
            <button onClick={handleSignup} className={classes.signInButton}>
              Zapisz się
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
