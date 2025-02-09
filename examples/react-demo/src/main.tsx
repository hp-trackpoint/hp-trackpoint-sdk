import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
// import { sdkCore } from "@tracking-sdk/core";

// 初始化 SDK
// init({
//   dsn: "http://localhost:3000/collect",
//   appName: "react-demo",
//   appCode: "REACT-DEMO",
//   appVersion: "1.0.0",
//   debug: true,
//   pv: true,
//   performance: {
//     core: true,
//     firstResource: true,
//     server: true,
//   },
//   error: {
//     core: true,
//     server: true,
//   },
//   event: {
//     core: true,
//   },
// });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
