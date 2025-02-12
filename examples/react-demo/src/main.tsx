import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import sdkCore from "../../../packages/core/src/index.ts";

sdkCore.init({
  dsn: "http://localhost:3000/collect",
  appName: "react-demo",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
