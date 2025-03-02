import type { Plugin } from "@tracking-sdk/core/src";
import { ErrorMonitoringPlugin } from "./errorMonitorPlugin";

export * from "./type";
export * from "./utils/stackParser";

export const errorMonitoringPlugin: Plugin = new ErrorMonitoringPlugin();
