import { Router } from "express";
import { deletePublication, getPublications, getPublicationsById, savePublication, updatePublication } from "./publication.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { check } from "express-validator";
import { validatePublication } from "../middlewares/validate-publication.js";


const router = Router();

router.get("/", getPublications);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    validateFields
  ],
  getPublicationsById
);

router.post("/", validatePublication, savePublication);

router.put(
  "/:id",
  [
    validatePublication,
    check("id", "No es un ID valido").isMongoId(),
    validateFields,
  ],
  updatePublication
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    validateFields,
  ],
  deletePublication
);

export default router;