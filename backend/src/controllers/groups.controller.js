const asyncHandler = require("../utils/asyncHandler");
const Group = require("../models/Group.model");

const getGroups = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category && category !== "All") filter.category = category;

  const groups = await Group.find(filter)
    .populate("admin", "firstName lastName username profilePicture")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: groups });
});

const getMyGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ members: req.user._id })
    .populate("admin", "firstName lastName username profilePicture")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: groups });
});

const createGroup = asyncHandler(async (req, res) => {
  const { name, description, privacy, category, cover } = req.body;
  const group = await Group.create({
    name, description, privacy, category, cover,
    admin: req.user._id,
    members: [req.user._id],
  });
  await group.populate("admin", "firstName lastName username profilePicture");
  res.status(201).json({ success: true, data: group });
});

const joinGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ success: false, message: "Group not found" });
  if (group.members.includes(req.user._id))
    return res.status(400).json({ success: false, message: "Already a member" });
  group.members.push(req.user._id);
  await group.save();
  res.json({ success: true, message: "Joined group" });
});

const leaveGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ success: false, message: "Group not found" });
  group.members = group.members.filter((m) => m.toString() !== req.user._id.toString());
  await group.save();
  res.json({ success: true, message: "Left group" });
});

const deleteGroup = asyncHandler(async (req, res) => {
  await Group.findOneAndDelete({ _id: req.params.id, admin: req.user._id });
  res.json({ success: true, message: "Group deleted" });
});

module.exports = { getGroups, getMyGroups, createGroup, joinGroup, leaveGroup, deleteGroup };
