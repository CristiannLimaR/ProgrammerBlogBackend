import { Schema, model } from "mongoose";
const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Anonymous",
      required: true,
    },
    publication: {
      type: Schema.Types.ObjectId,
      ref: "Publication",
      required: true,
      autopopulate: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Comment", CommentSchema);
