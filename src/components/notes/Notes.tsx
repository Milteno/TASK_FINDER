import React, { useState } from "react";
import {
  useCreateNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../../redux/features/apiSlice/apiSlice";

const Notes = () => {
  const { data: notes, refetch } = useGetNotesQuery(null); // Przekazujemy `null` jako argument
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [newNote, setNewNote] = useState("");

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNote({
        content: newNote,
      });
      setNewNote("");
      refetch();
    } catch (error) {
      console.error("Failed to create note", error);
    }
  };

  const handleUpdateNote = async (id: string, content: string) => {
    try {
      await updateNote({
        id,
        content,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update note", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateNote}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter your note here"
        ></textarea>
        <button type="submit">Add Note</button>
      </form>
      <ul>
        {notes &&
          notes.map((note: any) => (
            <li key={note._id}>
              <textarea
                value={note.content}
                onChange={(e) => handleUpdateNote(note._id, e.target.value)}
              ></textarea>
              <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Notes;
