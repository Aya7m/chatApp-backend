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

const allowedOrigins = ["http://localhost:5173"]; // للتطوير
// allowedOrigins.push("https://your-frontend-domain.com"); // لو هتنشري الفرونت

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);

await connectDB();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Server listening on port ${port}!`));