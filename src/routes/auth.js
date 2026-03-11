import { Router } from "express";
import { login, logout, signUp } from "../controller/auth.controller.js";

const authRouter = Router();
authRouter.post("/register", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
