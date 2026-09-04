import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./middleware/errorHandler";
import { healthRouter } from "./routes/health";
import { monitorsRouter } from "./routes/monitors";

export function createApp(): Express {
  const app = express();

  // CORS_ORIGIN can be a comma-separated list (e.g. the web + dashboard prod
  // URLs). Left unset, all origins are allowed — fine for local dev, but set
  // this in production.
  const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim());
  app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/monitors", monitorsRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "NotFound" });
  });

  // Error handler must be registered last.
  app.use(errorHandler);

  return app;
}
