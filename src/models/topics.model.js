const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var commentsSchema = Schema({
  id: String,
  userId: String,
  username: { type: String, required: true },
  comment: { type: String, required: true },
  _id: false,
});

const topicsSchema = new Schema(
  {
    id: String,
    topicName: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
    },
    topicStarterName: String,
    comments: [commentsSchema],
  },
  { timestamps: true }
);

const TopicsModel = mongoose.model("TopicsModel", topicsSchema);
module.exports = TopicsModel;
