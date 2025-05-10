import { body, check } from "express-validator";
import Publication from "../publication/publication.model.js";
export const validatePublication = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),

  body("content")
    .notEmpty().withMessage("Content is required")
    .isLength({ min: 10 }).withMessage("Content must be at least 10 characters long"),

  body("course")
    .optional()
    .isIn(["Tech", "Practice", "Workshop"]).withMessage("Invalid course value"),

  body("author")
    .optional()
    .isString().withMessage("Author must be a string"),
];

export const validatePublicationExists = [
    check("id").custom(async (id) => {
        const publication = await Publication.findById(id);
        if (!publication || !publication.state) {
          throw new Error("Publication not found or inactive");
        }
        return true;
      }),
  ];
  