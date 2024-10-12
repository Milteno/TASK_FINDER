import LoginPage from "./loginPage/loginPage";
import MainPage from "./mainPage/mainPage";
import MapPage from "./mapPage/mapPage";
import TaskDetails from "./notesPage/taskDetails";
import TasksPage from "./notesPage/tasksPage";
import RegisterPage from "./registerPage/registerPage";
import UserSettingsPage from "./userSettingsPage/userSettingsPage";

export const ROUTES = [
  {
    id: "home",
    component: <MainPage />,
    url: "home",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
  {
    id: "register",
    component: <RegisterPage />,
    url: "register",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
  {
    id: "login",
    component: <LoginPage />,
    url: "login",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
  {
    id: "map",
    component: <MapPage />,
    url: "map",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
  {
    id: "tasks",
    component: <TasksPage />,
    url: "tasks",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
  {
    id: "user-settings",
    component: <UserSettingsPage />,
    url: "user-settings",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
  {
    id: "task-details",
    component: <TaskDetails />,
    url: "task/:id",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
];
