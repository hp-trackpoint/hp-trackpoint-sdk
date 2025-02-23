import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import sdkCore from "../../../packages/core/src/index.ts";
import { BehaviorMonitoringPlugin } from "../../../packages/plugins/src/behavior-monitoring/index.ts";

sdkCore.init({
  dsn: "http://62.234.16.19/track-report",
  methods: "XHR",
  appName: "track_demo",
  debug: true,
  error: true,
});
sdkCore.logError("logerrorerrorerrorerror");
sdkCore.exportMethods.transportData();

sdkCore.use(new BehaviorMonitoringPlugin({
  enableClick: true,
  enablePV: true,
  enableRoute: true,
  ignoreUrls:['/api', '/health'],
}));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
