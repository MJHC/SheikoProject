import express from 'express';
export const router = express.Router();
import * as easyDB from '../scripts/easyData.js';

//router.get('/', easyDB.homePage);
router.get('/', easyDB.testPage);
router.get('/login', easyDB.loginPage);
router.post('/login', easyDB.login);
router.get('/home', easyDB.homePage);
router.post('/create', easyDB.createAccount);
router.post('/logout', easyDB.logout);
router.get('/load', easyDB.getProgram);