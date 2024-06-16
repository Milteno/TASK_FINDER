import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetMapNotesQuery } from "../../redux/features/apiSlice/apiSlice";
import classes from "./mapPage.module.scss";

const MapPage: React.FC = () => {
  const { data: notes, error, isLoading } = useGetMapNotesQuery({});
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading notes</div>;
  }

  return (
    <div className={classes.mapPageWrapper}>
      <div className={classes.mapPageContent}>
        {notes &&
          notes.map((note: any) => (
            <div
              key={note._id}
              className={classes.noteCard}
              onClick={() => navigate(`/note/${note._id}`)}
            >
              <h3>{note.title}</h3>
              <p>Hourly Rate: ${note.hourlyRate}</p>
              <p>Location: {note.location}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MapPage;
