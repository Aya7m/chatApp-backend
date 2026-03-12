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


app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);

await connectDB();
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
