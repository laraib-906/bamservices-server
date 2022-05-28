import express from "express";
import * as auth from "../../../middlewares/authenticate.js";
import controller from "./auth.controller.js";

const router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.getLoggedInUser);
router.post('/login', controller.login);
router.post('/forget-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

export default router;
