import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ErrorDemo from "./pages/ErrorDemo";
import PerformanceDemo from "./pages/PerformanceDemo";
import EventDemo from "./pages/EventDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/error",
    element: <ErrorDemo />,
  },
  {
    path: "/performance",
    element: <PerformanceDemo />,
  },
  {
    path: "/event",
    element: <EventDemo />,
  },
]);
