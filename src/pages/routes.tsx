import LoginPage from "./loginPage/loginPage";
import MainPage from "./mainPage/mainPage";
import MapPage from "./mapPage/mapPage";
import NoteDetails from "./notesPage/noteDetail";
import NotesPage from "./notesPage/notesPage";
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
    id: "notes",
    component: <NotesPage />,
    url: "notes",
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
    id: "note-details",
    component: <NoteDetails />,
    url: "note/:id",
    exact: true,
    label: "",
    linkId: "",
    auth: false,
  },
];
