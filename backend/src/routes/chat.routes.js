const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const { getConversations, getOrCreateConversation, getMessages, sendMessage } = require("../controllers/chat.controller");

router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages", sendMessage);

module.exports = router;
