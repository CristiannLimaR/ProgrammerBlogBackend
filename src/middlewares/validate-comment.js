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




export const isCommentAuthorByName = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { author } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        msg: "Comment not found",
      });
    }

    if (comment.author !== author) {
      return res.status(403).json({
        success: false,
        msg: "Only the original author can edit this comment",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error verifying comment author",
      error: error.message,
    });
  }
};

export const validateCommentExists = [
    check("id").custom(async (id) => {
        const comment = await Comment.findById(id);
        if (!comment) {
          throw new Error("Comment not found in database");
        }
        return true;
      }),
  ];
  