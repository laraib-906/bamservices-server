import { Router } from "express";
import user from './user/router.js';
import auth from './auth/router.js';
import file from './files/router.js';
const router = Router();

router.use('/user', user);
router.use('/auth', auth);
router.use('/file', file);

export default router;