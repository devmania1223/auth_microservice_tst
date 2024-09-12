import { Router } from 'express';
import { registerUserController, loginUserController, validateSessionController, logoutUserController } from '../controllers/authController';

const router = Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/session/:sessionId', validateSessionController);
router.delete('/logout', logoutUserController); 

export default router;
