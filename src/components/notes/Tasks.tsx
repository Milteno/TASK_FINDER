import React, { useState } from "react";
import {
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../../redux/features/apiSlice/apiSlice";

const Tasks = () => {
  const { data: tasks, refetch } = useGetTasksQuery(null);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [newTask, setNewTask] = useState("");

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        content: newTask,
      });
      setNewTask("");
      refetch();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleUpdateTask = async (id: string, content: string) => {
    try {
      await updateTask({
        id,
        content,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateTask}>
        <textarea
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter your task here"
        ></textarea>
        <button type="submit">Dodaj ogłoszenie</button>
      </form>
      <ul>
        {tasks &&
          tasks.map((task: any) => (
            <li key={task._id}>
              <textarea
                value={task.content}
                onChange={(e) => handleUpdateTask(task._id, e.target.value)}
              ></textarea>
              <button onClick={() => handleDeleteTask(task._id)}>Usuń</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Tasks;
