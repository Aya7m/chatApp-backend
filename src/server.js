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

// مهم جدا
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

// السماح بالـ preflight
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","http://localhost:5173");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers","Content-Type, Authorization");
  
  if(req.method === "OPTIONS"){
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);

await connectDB();

app.get("/",(req,res)=>{
  res.send("Server working");
});

app.listen(port,()=>{
  console.log("Server running on port",port);
});