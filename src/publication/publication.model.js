import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const PublicationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      enum: ['Tech', 'Practice', 'Workshop']
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Cristian Lima"
    },

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        autopopulate: {select:'author content createdAt',},
      },
    ],
    likes: {
      type: Number,
      default: 0,
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

PublicationSchema.plugin(mongooseAutoPopulate);

export default model("Publication", PublicationSchema);
