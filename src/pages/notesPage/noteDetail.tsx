import React from "react";
import { useParams } from "react-router-dom";
import { useGetNoteByIdQuery } from "../../redux/features/apiSlice/apiSlice";
import classes from "./noteDetails.module.scss";

const NoteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: note, error, isLoading } = useGetNoteByIdQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading note details</div>;
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <div className={classes.noteDetailsWrapper}>
      <div className={classes.noteDetailsContent}>
        <h1>{note.title}</h1>
        <p>Date: {new Date(note.date).toLocaleDateString()}</p>
        <p>Time: {note.time}</p>
        <p>Location: {note.location}</p>
        <p>Phone: {note.phoneNumber}</p>
        <p>Tasks: {note.tasks}</p>
        <p>Duration: {note.duration}</p>
        <p>Additional Info: {note.additionalInfo}</p>
        <p>Hourly Rate: ${note.hourlyRate}</p>
        <p>By: {note.userId.username}</p>
      </div>
    </div>
  );
};

export default NoteDetails;
