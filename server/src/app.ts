import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "FinTrack Pro API Running",
  });
});

app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "FinTrack API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use(errorHandler);

export default app;