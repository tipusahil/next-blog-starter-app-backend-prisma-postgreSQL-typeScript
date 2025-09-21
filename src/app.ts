import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./app/router/router";
import { envVars } from "./app/config/env.config";

const app = express();
dotenv.config();
// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: [envVars.FRONTEND_URL,envVars.FRONTEND_DEV_URL].filter(Boolean),
    credentials: true,
  })
);

app.use("/api/v1", router);

// Default route for testing
app.get("/", (_req, res) => {
  res.send("Welcome To  next-blog-starter app Backend..🎉");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
