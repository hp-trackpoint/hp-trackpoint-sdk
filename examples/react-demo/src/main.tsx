import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import sdkCore from "@tracking-sdk/core";
import {
  BehaviorMonitoringPlugin,
  PerformancePlugin,
} from "@tracking-sdk/plugins";

sdkCore.init({
  dsn: "http://62.234.16.19/track-report",
  methods: "XHR",
  appName: "track_demo",
  debug: true,
  error: true,
});

sdkCore.use(
  new BehaviorMonitoringPlugin({
    enableClick: true,
    enablePV: true,
    enableRoute: true,
    ignoreUrls: ["/event", "/health"],
  })
);
sdkCore.use(new PerformancePlugin());
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
