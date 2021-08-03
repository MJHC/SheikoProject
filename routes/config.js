import express from 'express';
export const router = express.Router();
import * as easyDB from '../scripts/easyData.js';
import * as pages from '../scripts/pages.js';
import * as acc from '../scripts/account.js';

// Pages
router.get('/login', pages.loginPage);
router.get('/create', pages.createAccountPage);

router.get('/', pages.homePage);
router.get('/workout', pages.workoutPage);
router.get('/editor', pages.editorPage)

// Account management
router.post('/login', acc.login);
router.post('/create', acc.createAccount);
router.post('/logout', acc.logout);

// Workout 
router.get('/load', easyDB.getProgram);
router.get('/programs', easyDB.programs);
router.post('/nextworkout', easyDB.nextWorkout);
router.post('/changeprogram', easyDB.changeProgram);
router.post('/updatestats', easyDB.updateStats);