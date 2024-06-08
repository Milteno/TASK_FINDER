import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
} from "../../redux/features/apiSlice/apiSlice";
import { useNavigate } from "react-router-dom";
import classes from "./notesPage.module.scss";

const NotesPage: React.FC = () => {
  const { data: notes, error, isLoading, refetch } = useGetNotesQuery({});
  const [createNote] = useCreateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [noteContent, setNoteContent] = useState("");
  const token = useSelector((state: any) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      refetch(); // Odśwież notatki po zmianie użytkownika
    }
  }, [token, refetch]);

  const handleCreateNote = async () => {
    await createNote({ content: noteContent });
    setNoteContent("");
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token || error) {
    return (
      <div>
        <p>Zaloguj się, aby wyświetlić treść</p>
        <button onClick={() => navigate("/login")}>Logowanie</button>
      </div>
    );
  }

  return (
    <div className={classes.notesPageWrapper}>
      <div className={classes.notesPageContent}>
        <div>
          <input
            type="text"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a new note"
          />
          <button onClick={handleCreateNote}>Add Note</button>
        </div>
        {notes &&
          notes.map((note: any) => (
            <div key={note._id} className={classes.note}>
              <p>{note.content}</p>
              <p>By: {note.userId.username}</p>
              <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotesPage;
