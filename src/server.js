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

// 👇 URLs المسموح بها
const allowedOrigins = [
  "http://localhost:5173",                   // للتطوير
  "https://chatapp-frontend.onrender.com"    // لو نشرتي الفرونت على Render
];

// 👇 CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 👇 Express JSON & cookies
app.use(express.json());
app.use(cookieParser());

// 👇 Routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);

// 👇 Connect to DB
await connectDB();

// 👇 Test route
app.get("/", (req, res) => res.send("Hello World!"));

// 👇 Listen
app.listen(port, () => console.log(`Server listening on port ${port}!`));