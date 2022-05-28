import express from "express";
import controller from "./user.controller.js";

const router = express.Router();

router.post('/', controller.create);

export default router;
