const express = require("express");
const router = express.Router();
//const { protectRoute } = require("../middleware/auth");

const {
  findAllTopics,
  createOneTopic,
  findOneTopic,
  createOneComment,
} = require("../controllers/topics.controller");

router.get("/", findAllTopics);
router.post("/", createOneTopic);
router.get("/:id", findOneTopic);
router.post("/:id/comments", createOneComment);

//router.get("/:id", findOneTopic);
//router.post("/:id/reviews", protectRoute, createOneComment);

module.exports = router;
