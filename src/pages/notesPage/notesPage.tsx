import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "../../redux/features/apiSlice/apiSlice";
import classes from "./notesPage.module.scss";
import AddNote from "./addNote";
import { useNavigate } from "react-router-dom";

const NotesPage: React.FC = () => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const { data: notes, error, isLoading, refetch } = useGetNotesQuery({});
  const [deleteNote] = useDeleteNoteMutation();
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const username = useSelector((state: any) => state.user.username);
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    refetch();
  };

  const handleEdit = (id: string) => {
    const noteToEdit = notes.find((note: any) => note._id === id);
    setEditingNoteId(id);
    setIsAddingNote(true);
  };

  const handleCancelAddNote = () => {
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  const handleSaveNote = async (note: any) => {
    if (editingNoteId) {
      await updateNote({ id: editingNoteId, ...note });
      setEditingNoteId(null);
    } else {
      await createNote(note);
    }
    setIsAddingNote(false);
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
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
        {isAddingNote ? (
          <AddNote onCancel={handleCancelAddNote} onSave={handleSaveNote} />
        ) : (
          <>
            <button onClick={() => setIsAddingNote(true)}>
              Utwórz notatkę
            </button>
            {notes &&
              notes.map((note: any) => (
                <div key={note._id} className={classes.note}>
                  <h3>{note.title}</h3>
                  <p>Date: {new Date(note.date).toLocaleDateString()}</p>
                  <p>Time: {note.time}</p>
                  <p>Location: {note.location}</p>
                  <p>Phone: {note.phoneNumber}</p>
                  <p>Tasks: {note.tasks}</p>
                  <p>Duration: {note.duration}</p>
                  <p>Additional Info: {note.additionalInfo}</p>
                  <p>Hourly Rate: ${note.hourlyRate}</p>
                  <p>By: {note.userId.username}</p>
                  <button onClick={() => handleEdit(note._id)}>Edytuj</button>
                  <button onClick={() => handleDelete(note._id)}>Usuń</button>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
