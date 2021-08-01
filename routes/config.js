import express from 'express';
export const router = express.Router();
import * as easyDB from '../scripts/easyData.js';

router.get('/', easyDB.homePage);
//router.get('/', easyDB.testPage);
router.get('/login', easyDB.loginPage);
router.post('/login', easyDB.login);
router.post('/create', easyDB.createAccount);
router.get('/create', easyDB.createAccountPage);
router.post('/logout', easyDB.logout);

router.get('/workout', easyDB.workout);
router.get('/load', easyDB.getProgram);
router.post('/nextworkout', easyDB.nextWorkout);
router.get('/programs', easyDB.programs);
router.post('/changeprogram', easyDB.changeProgram);
router.post('/updatestats', easyDB.updateStats);