import express from 'express';
export const router = express.Router();
import * as easyDB from '../js/easyData.js';

router.get('/', easyDB.homePage);

router.get('/login', easyDB.loginPage);

router.post('/login', easyDB.login);
