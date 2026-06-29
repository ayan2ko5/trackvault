import app from "./app";
import { env } from "./config/env";

const PORT = Number(env.PORT);

const server = app.listen(PORT, () => {
  console.log("========================================");
  console.log(" FinTrack Pro API");
  console.log(` Running on http://localhost:${PORT}`);
  console.log(
    ` Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log("========================================");
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);

  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));