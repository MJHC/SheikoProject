import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql';
import bcrypt from 'bcrypt';
const salt = 10;

const DB = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.DBPASS,
    database: process.env.DB
}); 
  
DB.connect(connectMSG);

function connectMSG(err){
    if(err) throw err;
    console.log("Connected to MySQL Server");
}

export const sessionOptions = {
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    /*cookie: {maxAge: (60000*5)}*/
}

export function homePage(req, res){
    if(req.session.loggedIn)
        res.render('index', {user: req.session.username, title: "Home Page"}); 
    else res.redirect('/login');
}

export function testPage(req, res){
    res.render('programtest');
}

export function login(req, res){
    const sqlQuery = `SELECT username, password FROM users WHERE username=?`;
    const noInput = "Please enter user and pass";
    const user = req.body.user, pass = req.body.pass;

    if(user && pass){
        DB.query(sqlQuery, [user, pass], loginReq);
    } else{
        res.send(noInput);
        res.end();
    }

    function loginReq(err, result){
        if (err) throw err;
        if(result.length > 0) bcrypt.compare(pass, result[0].password, passCompare);
    }

    function passCompare(err, result){
        if(err) throw err;
        if(result){
            req.session.loggedIn = true;
            req.session.username = user;
            res.redirect('/');
        } else{
            res.send("Incorrect input");
        }
        res.end();
    }
}

export function loginPage(req, res){
    if(!req.session.loggedIn)
        res.render('login', {layout: './layouts/login', title: 'Login Page'}); 
    else res.redirect('/');
}

export function getItems(req, res){
    const getItem = `SELECT item FROM items 
                     JOIN users ON items.owner_id = users.id AND users.username=?`;
    DB.query(getItem, [req.session.username], resItems);

    function resItems(err, result){
        if(err) throw err;
        if(result.length > 0){
            console.log(result);
            res.json(result);
            res.end();
        }
    }
}

export function createAccount(req, res){
    const sqlQuery = `INSERT INTO users (email, username, hash) VALUES(?, ?, ?)`;
    const successMsg = "Account Created!";
    const failedMsg = "Account Creation Failed!";

    const user = req.body.user, pass = req.body.pass, email = req.body.email;

    if(email && user && pass){
        bcrypt.hash(pass, salt, createHashedPass);
        res.send(successMsg);
        res.end();
    }else{
        res.send(failedMsg);
        res.end();
    }

    function createHashedPass(err, hash){
        if(err) throw err;
        DB.query(sqlQuery, [email, user, hash], err =>{
            if(err) throw err;
        });
    }
}

export function logout(req, res){
    req.session.destroy();
    console.log("logged out");
    res.redirect('/');
    res.end();
}

export function getProgram(req, res){
    const sqlQuery = 
    `SELECT 
    week, day, all_exercises.name, ex_list, ex_list_item, sets, reps, procent
    FROM exercises 
    INNER JOIN all_exercises 
    ON (exercises.exercise_id=all_exercises.id) 
    AND exercises.program_id = ?
    AND exercises.week = ?
    AND exercises.day = ?
    ORDER BY ex_list;`

    DB.query(sqlQuery, [10, 1, 1], getProgramSQL);

    function getProgramSQL(err, result){
        if(err) throw err;
        if(result.length > 0){
            console.table(result);
            res.send(result);
        }
    }
}