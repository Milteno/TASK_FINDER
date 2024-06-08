import React from "react";
import { useGetMapNotesQuery } from "../../redux/features/apiSlice/apiSlice";
import classes from "./mapPage.module.scss";

const MapPage: React.FC = () => {
  const { data: notes, error, isLoading } = useGetMapNotesQuery({});

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
            <div key={note._id} className={classes.note}>
              <p>{note.content}</p>
              <p>By: {note.userId.username}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MapPage;
