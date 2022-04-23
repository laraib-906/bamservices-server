import express from "express";
import { uploadMiddleware } from "../../../middlewares/file-upload";
import controller from "./files.controller";

const router = express.Router();

router.get('/', controller.getFilesList);
router.post('/', uploadMiddleware().single('file'), controller.uploadFile);
router.get('/:id', controller.getFileByID);
router.delete('/:id', controller.deleteFile);

export default router;
