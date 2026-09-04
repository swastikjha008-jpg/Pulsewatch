import { Router } from "express";
import * as controller from "../controllers/monitors.controller";
import { validateBody } from "../middleware/validate";
import { createMonitorSchema, updateMonitorSchema } from "../validators/monitor.schema";

export const monitorsRouter = Router();

monitorsRouter.get("/", controller.listMonitorsHandler);
monitorsRouter.post("/", validateBody(createMonitorSchema), controller.createMonitorHandler);
monitorsRouter.get("/:id", controller.getMonitorHandler);
monitorsRouter.patch("/:id", validateBody(updateMonitorSchema), controller.updateMonitorHandler);
monitorsRouter.delete("/:id", controller.deleteMonitorHandler);

// Bonus: recent time-series checks for a monitor
monitorsRouter.get("/:id/checks", controller.listChecksHandler);
