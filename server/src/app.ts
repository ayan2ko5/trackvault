import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "FinTrack Pro API Running"
  });
});

export default app;