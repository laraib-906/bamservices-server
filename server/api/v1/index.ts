import { Router } from 'express';

import authRouter from './auth';
import userRouter from './user';
import fileRouter from './files';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/file', fileRouter);

export default router;
