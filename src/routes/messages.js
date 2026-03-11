import { Router } from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controller/message.controller.js";
import { protectedRouter } from "../middleware/protectRouter.js";

const messagesRouter = Router();
messagesRouter.use(protectedRouter)
messagesRouter.get("/get-contacts", getAllContacts);
messagesRouter.get('/chats',getChatPartners)
messagesRouter.get("/:id", getMessagesByUserId);
messagesRouter.post("/send/:id", sendMessage);

export default messagesRouter;
