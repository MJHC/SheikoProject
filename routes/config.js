const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login'); 
});

router.get('/login', (req, res) => {
  res.render('index', {layout: './layouts/login', title: 'Login Page'}); 
});

router.get('/workout', (req, res) => {
  res.render('workout', {title: 'Workout'}); 
});

router.get('/settings', (req, res) => {
  res.render('settings', {title: 'Settings'}); 
});

module.exports = router;