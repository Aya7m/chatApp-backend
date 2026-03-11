import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import messagesRouter from "./routes/messages.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// لو شغالين على localhost للتطوير:
const allowedOrigins = ["http://localhost:5173"]; 

// لو هتنشري الفرونت على الإنترنت:
// allowedOrigins.push("https://your-frontend-domain.com");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ضروري للكوكيز
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ضيفي كل الـ methods الممكنة
    allowedHeaders: ["Content-Type", "Authorization"], // ضيفي الـ headers اللي هتبعتيها
  })
);

// لاز
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);

await connectDB();
app.get("/", (req, res) => res.send("Hello World!"));
// لازم كمان Express يرد على preflight requests

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
