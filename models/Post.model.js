const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Post = model("Post", postSchema);

module.exports = Post;
