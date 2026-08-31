const asyncHandler = require("../utils/asyncHandler");
const Conversation = require("../models/Conversation.model");
const Message = require("../models/Message.model");

// GET /api/v1/chat/conversations
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "firstName lastName username profilePicture")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });

  res.json({ success: true, data: conversations });
});

// POST /api/v1/chat/conversations  { recipientId }
const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const me = req.user._id;

  let conversation = await Conversation.findOne({
    participants: { $all: [me, recipientId], $size: 2 },
  }).populate("participants", "firstName lastName username profilePicture");

  if (!conversation) {
    conversation = await Conversation.create({ participants: [me, recipientId] });
    conversation = await conversation.populate("participants", "firstName lastName username profilePicture");
  }

  res.json({ success: true, data: conversation });
});

// GET /api/v1/chat/conversations/:conversationId/messages
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });
  if (!conversation) return res.status(403).json({ success: false, message: "Forbidden" });

  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "firstName lastName profilePicture")
    .sort({ createdAt: 1 });

  // mark as read
  await Message.updateMany(
    { conversation: conversationId, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );

  res.json({ success: true, data: messages });
});

// POST /api/v1/chat/conversations/:conversationId/messages  { text }
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });
  if (!conversation) return res.status(403).json({ success: false, message: "Forbidden" });

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    text,
    readBy: [req.user._id],
  });

  await message.populate("sender", "firstName lastName profilePicture");

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  // emit via socket
  const io = req.app.get("io");
  if (io) io.to(conversationId).emit("new_message", message);

  res.status(201).json({ success: true, data: message });
});

module.exports = { getConversations, getOrCreateConversation, getMessages, sendMessage };
