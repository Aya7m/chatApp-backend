import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messages.model.js";
import { User } from "../models/user.model.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedInUser } }).select(
      "_password",
    );
    res.json(filteredUser);
  } catch (error) {
    console.log("error in get all contacts");
    res.status(500).json({ message: "server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  // messages between me and user
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.json(messages);
  } catch (error) {
    console.log("error in get message", error);
    res.status(500).json({ message: "server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "text or image is required" });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "you can't send message to yourself" });
    }

    const receiver = await User.exists({ _id: receiverId });
    if (!receiver) {
      return res.status(404).json({ message: "receiver not found" });
    }

    let imgUrl;
    const uploadResponse = await cloudinary.uploader.upload(image);
    imgUrl = uploadResponse.secure_url;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imgUrl,
    });

    await newMessage.save();

    // todo send message in real-time if user is online in socket-io
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in send message", error);

    res.status(500).json({ message: "server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    // find all messages if user is sender or reciever
    const messages = await Message.find({
      $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
    });

    // Set في JavaScript بيخزن قيم فريدة فقط.

    const chatPartnersIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUser
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    // هات كل المستخدمين اللي _id بتاعهم موجود جوه chatPartnersIds

    const chatPartners = await User.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("error in get chatPartners");
    res.status(500).json({ message: "server error" });
  }
};
