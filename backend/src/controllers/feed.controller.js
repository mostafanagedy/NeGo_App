const asyncHandler = require("../utils/asyncHandler");
const { getPersonalizedFeed } = require("../services/feed.service");

const getFeed = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await getPersonalizedFeed(req.user._id, page, limit);

  return res.status(200).json({
    success: true,
    data: result.posts,
    pagination: result.pagination,
  });
});

module.exports = {
  getFeed,
};
