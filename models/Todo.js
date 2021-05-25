const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Todo = new Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    completed: {
      type: Boolean,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", Todo);
