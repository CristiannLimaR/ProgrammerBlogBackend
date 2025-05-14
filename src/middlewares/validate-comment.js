import Comment from "../comment/comment.model.js";
import { body, check } from "express-validator";

export const validateComment = [
  body("content")
    .notEmpty().withMessage("Content is required")
    .isLength({ min: 3 }).withMessage("Content must be at least 3 characters"),

  body("author")
    .optional()
    .isString().withMessage("Author must be a string"),
];




export const validateCommentExists = [
    check("id").custom(async (id) => {
        const comment = await Comment.findById(id);
        if (!comment) {
          throw new Error("Comment not found in database");
        }
        return true;
      }),
  ];
  