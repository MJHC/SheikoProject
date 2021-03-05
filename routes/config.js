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

router.get('/programs', (req, res) => {
  res.render('programs', {title: 'Programs'}); 
});

router.get('/programs', (req, res) => {
  res.render('programs', {title: 'Programs'}); 
});

router.get('/settings', (req, res) => {
  res.send("Under Construction"); 
});

router.get('/body', (req, res) => {
  res.send("Under Construction");
});

module.exports = router;