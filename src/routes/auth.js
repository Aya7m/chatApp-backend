import { Router } from "express";
import {
  login,
  logout,
  signUp,
  updateProfile,
} from "../controller/auth.controller.js";
import { protectedRouter } from "../middleware/protectRouter.js";

const authRouter = Router();
authRouter.post("/register", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.put("/update-profile", protectedRouter, updateProfile);
authRouter.get("/check-auth", protectedRouter, (req, res) => {
  res.status(200).json(req.user);
});
export default authRouter;
