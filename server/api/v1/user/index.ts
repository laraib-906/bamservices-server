import express from "express";
import controller from "./user.controller";

const router = express.Router();

router.post('/', controller.create);

export default router;
