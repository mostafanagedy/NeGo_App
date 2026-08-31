const asyncHandler = require("../utils/asyncHandler");
const Event = require("../models/Event.model");

const getEvents = asyncHandler(async (req, res) => {
  const { category, q } = req.query;
  const filter = { startDate: { $gte: new Date() } };
  if (category && category !== "All") filter.category = category;
  if (q) filter.$text = { $search: q };

  const events = await Event.find(filter)
    .populate("host", "firstName lastName username profilePicture")
    .sort({ startDate: 1 })
    .limit(50);

  res.json({ success: true, data: events });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ attendees: req.user._id })
    .populate("host", "firstName lastName username profilePicture")
    .sort({ startDate: 1 });
  res.json({ success: true, data: events });
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, host: req.user._id, attendees: [req.user._id] });
  await event.populate("host", "firstName lastName username profilePicture");
  res.status(201).json({ success: true, data: event });
});

const attendEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  if (!event.attendees.includes(req.user._id)) event.attendees.push(req.user._id);
  await event.save();
  res.json({ success: true, message: "Attending event" });
});

const leaveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  event.attendees = event.attendees.filter((a) => a.toString() !== req.user._id.toString());
  await event.save();
  res.json({ success: true, message: "Left event" });
});

module.exports = { getEvents, getMyEvents, createEvent, attendEvent, leaveEvent };
