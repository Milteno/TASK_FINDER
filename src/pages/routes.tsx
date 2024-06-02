import LoginPage from "./loginPage/loginPage";
import MainPage from "./mainPage/mainPage";
import RegisterPage from "./registerPage/registerPage";

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
];
