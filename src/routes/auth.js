import { Router } from "express";
import { signUp } from "../controller/auth.controller.js";

const authRouter=Router()
authRouter.post('/register',signUp)

export default authRouter