import { createBrowserRouter } from "react-router-dom";
import App from "./App";                          // <-- antes era "./app/App"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Purchases from "./pages/Purchases";
import Buy from "./pages/Buy";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Events /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "purchases", element: <Purchases /> },
          { path: "buy/:eventId", element: <Buy /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      {
        element: <RoleGuard allow={["admin"]} />,
        children: [
          { path: "events/admin", element: <Events admin /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

