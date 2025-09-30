import compression from "compression";
/* compression প্যাকেজ কী?
লাইব্রেরি টাইপ: Express.js (অথবা Connect-based frameworks) এর জন্য Middleware।
মূল কাজ: Response body gzip বা Brotli compress করে ক্লায়েন্টে পাঠানো।
ফলাফল:
Response এর size কমে যায়।
Client এর কাছে ডাটা ট্রান্সফার দ্রুত হয়।
Network bandwidth বাঁচে।
Page load time improve করে। */
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
