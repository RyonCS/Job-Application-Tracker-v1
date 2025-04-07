import express from 'express';
const router = express.Router();

import { login, register, getLoginPage, getRegisterPage } from '../Controllers/authController.js';

router.get('/login', getLoginPage);

router.get('/register', getRegisterPage);

router.post('/login', login);

router.post('/register', register);

export default router;