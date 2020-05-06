const TopicsModel = require("../models/topics.model");

const wrapAsync = require("../utils/wrapAsync");
const { uuid } = require("uuidv4");

const findAllTopics = wrapAsync(async (req, res) => {
  const foundTopics = await TopicsModel.find(
    {},
    "-_id -createdAt -updatedAt -__v"
  );

  return res.status(200).json(foundTopics);
});

const createOneTopic = wrapAsync(async (req, res, next) => {
  const topicToCreate = {
    id: uuid(),
    topicName: req.body.topicName,
    topicStarterName: req.body.topicStarterName,
  };

  const topic = new TopicsModel(topicToCreate);
  const newTopic = await topic.save();
  res.status(201).send(newTopic);
});

const findOneTopic = wrapAsync(async (req, res, next) => {
  const id = req.params.id;
  const foundTopic = await TopicsModel.findOne(
    { id: id },
    "-_id -createdAt -updatedAt -__v"
  );

  if (foundTopic) {
    res.status(200).json(foundTopic);
  } else {
    const err = new Error("No data found");
    err.statusCode = 404;
    next(err);
  }
});

const createOneComment = wrapAsync(async (req, res, next) => {
  try {
    const topicToComment = req.params.id;

    const userID = "testuser"; //call a function to match req.user.id

    //console.log("setting addition comment");

    //console.log("req.body.comment", req.body.comment);
    const additionalComment = {
      id: uuid(), //id of comment
      userId: userID,
      username: "another user", //req.user.name,
      comment: req.body.comment,
    };
    // console.log("before foundTopic");
    const foundTopic = await TopicsModel.findOne(
      { id: topicToComment },
      "-_id -createdAt -updatedAt -__v"
    );

    if (!foundTopic) {
      throw new Error("No data found");
    }

    // console.log("foundTopic");
    const { comments, ...topicInfoNoComments } = foundTopic.toObject();

    // console.log("comments:", comments);
    const newCommentObj = [...comments, additionalComment];
    // console.log("newCommentObj:", newCommentObj);
    const updatedTopicComment = await TopicsModel.findOneAndUpdate(
      { id: topicToComment },
      { comments: newCommentObj },
      { new: true, projection: "-_id -createdAt -updatedAt -__v" }
    );
    // console.log("updatedTopicComment:", updatedTopicComment);

    res.status(201).json(additionalComment);
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
});

module.exports = {
  findAllTopics,
  createOneTopic,
  findOneTopic,
  createOneComment,
};
