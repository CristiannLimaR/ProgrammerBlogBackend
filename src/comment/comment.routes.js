import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { deleteComment, getCommentsByPost, saveComment, updateComment } from "./comment.controller.js";
import { isCommentAuthorByName , validateComment, validateCommentExists} from "../middlewares/validate-comment.js";

const router = Router();


router.get(
  "/publication/:postId",
  [
    check("postId", "No es un ID valido").isMongoId(),
    validateFields
  ],
  getCommentsByPost
);

router.post("/publication/:postId", validateComment, saveComment);

router.put(
  "/:id",
  [
    isCommentAuthorByName,
    check("id", "No es un ID valido").isMongoId(),
    validateCommentExists,
    validateFields,
  ],
  updateComment
);

router.delete(
  "/:id",
  [
    isCommentAuthorByName,
    check("id", "No es un ID valido").isMongoId(),
    validateCommentExists,
    validateFields,
  ],
  deleteComment
);

export default router;