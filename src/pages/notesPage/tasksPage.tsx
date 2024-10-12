import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useLazyGetApplicationsByTaskIdQuery,
} from "../../redux/features/apiSlice/apiSlice";
import classes from "./tasksPage.module.scss";
import AddTask from "./addTask";
import { useNavigate } from "react-router-dom";

const TasksPage: React.FC = () => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  const { data: tasks, error, isLoading, refetch } = useGetTasksQuery({});
  const [deleteTask] = useDeleteTaskMutation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const username = useSelector((state: any) => state.user.username);
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [tasksWithApplications, setTasksWithApplications] = useState<any[]>([]);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);

  const [
    triggerGetApplications,
    {
      data: applications,
      isLoading: isLoadingApplications,
      error: applicationsError,
    },
  ] = useLazyGetApplicationsByTaskIdQuery();

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (tasks) {
        const newTasks = await Promise.all(
          tasks.map(async (task: any) => {
            const response = await triggerGetApplications(task._id).unwrap();
            return { ...task, applications: response };
          })
        );
        setTasksWithApplications(newTasks);
      }
    };

    fetchApplications();
  }, [tasks, triggerGetApplications]);

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    refetch();
  };

  const handleEdit = (id: string) => {
    const taskToEdit = tasksWithApplications.find(
      (task: any) => task._id === id
    );
    setEditingTaskId(id);
    setTaskToEdit(taskToEdit);
    setIsAddingTask(true);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
    setEditingTaskId(null);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (task: any) => {
    if (editingTaskId) {
      await updateTask({ id: editingTaskId, ...task });
      setEditingTaskId(null);
      setTaskToEdit(null);
    } else {
      await createTask(task);
    }
    setIsAddingTask(false);
    refetch();
  };

  const handleViewApplications = async (taskId: string) => {
    setSelectedTaskId(taskId);
    await triggerGetApplications(taskId);
  };

  const handleViewApplicationDetails = (application: any) => {
    setSelectedApplication(application);
    setShowApplicationDetails(true);
  };

  const handleCloseApplicationDetails = () => {
    setSelectedApplication(null);
    setShowApplicationDetails(false);
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
    <div className={classes.tasksPageWrapper}>
      {selectedTaskId && applications ? (
        <div className={classes.applicationsList}>
          <h3>
            Zgłoszenia do{" "}
            {
              tasksWithApplications.find((n: any) => n._id === selectedTaskId)
                ?.title
            }
          </h3>
          {isLoadingApplications && <p>Ładowanie zgłoszeń...</p>}
          {applicationsError && <p>Błąd podczas ładowania zgłoszeń</p>}
          {applications.map((application: any) => (
            <div key={application._id} className={classes.application}>
              <p>Nazwa użytkownika: {application.userId.username}</p>
              <p>Imię: {application.userId.firstName}</p>
              <p>Nazwisko: {application.userId.lastName}</p>
              <p>Email: {application.userId.email}</p>
              <p>Numer telefonu: {application.userId.phoneNumber}</p>
              <button onClick={() => handleViewApplicationDetails(application)}>
                Szczegółowe informacje
              </button>
            </div>
          ))}
          <button onClick={() => setSelectedTaskId(null)}>Zamknij</button>
        </div>
      ) : (
        <div className={classes.tasksPageContent}>
          {isAddingTask ? (
            <AddTask
              onCancel={handleCancelAddTask}
              onSave={handleSaveTask}
              initialValues={taskToEdit}
            />
          ) : (
            <>
              <button
                onClick={() => setIsAddingTask(true)}
                className={classes.createTaskButton}
              >
                Utwórz ogłoszenie
              </button>
              <div className={classes.tasksList}>
                {tasksWithApplications &&
                  tasksWithApplications.map((task: any) => (
                    <div key={task._id} className={classes.task}>
                      <h3>{task.title}</h3>
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
                      <p>Stawka godzinowa: {task.hourlyRate}PLN</p>
                      <p>Kategoria: {task.category}</p>
                      <p>Opublikowane przez: {task.userId.username}</p>
                      <button onClick={() => handleEdit(task._id)}>
                        Edytuj
                      </button>
                      <button onClick={() => handleDelete(task._id)}>
                        Usuń
                      </button>
                      <button onClick={() => handleViewApplications(task._id)}>
                        Zgłoszenia ({task.applications?.length || 0})
                      </button>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {showApplicationDetails && selectedApplication && (
        <div className={classes.applicationDetails}>
          <h3>Szczegółowe informacje o zgłoszeniu</h3>
          <p>Numer telefonu: {selectedApplication.phoneNumber}</p>
          <p>PESEL: {selectedApplication.pesel}</p>
          <p>
            Status książeczki sanitarno-epidemiologicznej:{" "}
            {selectedApplication.sanitaryStatus}
          </p>
          <h4>Adres zamieszkania</h4>
          <p>Ulica: {selectedApplication.address.street}</p>
          <p>Numer domu: {selectedApplication.address.houseNumber}</p>
          <p>Numer mieszkania: {selectedApplication.address.apartmentNumber}</p>
          <p>Kod pocztowy: {selectedApplication.address.postalCode}</p>
          <p>Miasto: {selectedApplication.address.city}</p>
          <p>Powiat: {selectedApplication.address.district}</p>
          <h4>Oddział NFZ</h4>
          <p>{selectedApplication.nfzBranch}</p>
          <h4>Stan prawny</h4>
          <p>
            Czy jesteś uczniem szkoły ponadpodstawowej/studentem i nie
            ukończyłeś(-aś) 26 roku życia?:{" "}
            {selectedApplication.studentStatus ? "Tak" : "Nie"}
          </p>
          <p>
            Czy jesteś zatrudniony na umowę o pracę/umowę zlecenia u innego
            pracodawcy?: {selectedApplication.employmentStatus ? "Tak" : "Nie"}
          </p>
          <p>
            Czy jesteś uprawniony do emerytury? (osiągnąłem/osiągnęłam wiek
            emerytalny): {selectedApplication.pensionStatus ? "Tak" : "Nie"}
          </p>
          <p>
            Czy jesteś uprawniony do renty?:{" "}
            {selectedApplication.rentStatus ? "Tak" : "Nie"}
          </p>
          <p>
            Czy prowadzisz działalność gospodarczą?:{" "}
            {selectedApplication.businessStatus ? "Tak" : "Nie"}
          </p>
          <button onClick={handleCloseApplicationDetails}>Zamknij</button>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
