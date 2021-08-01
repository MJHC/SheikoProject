import {DB} from './easyData.js';
import bcrypt from 'bcrypt';
const salt = 10;

export let usersOnline = 0;
const users = {};

export function login(req, res){
    const sqlQuery = `SELECT username, hash FROM users WHERE username=?`;
    const sqlUserData = 
    `SELECT programs.concept_id, program_id, week, day, userstats.bench_max, userstats.squat_max, userstats.deadlift_max
    FROM userexerciselog
    INNER JOIN userstats on(userexerciselog.user_id = userstats.user_id)
    INNER JOIN programs on(userexerciselog.program_id = programs.id)
    WHERE userexerciselog.user_id in (SELECT id FROM users WHERE username = ?);`
    const noInput = "Please enter user and pass";
    const user = req.body.user, pass = req.body.pass;

    if(user && pass){
        if(!users[user])
            DB.query(sqlQuery, [user, pass], loginReq);
        else res.render('login', {title:'Login Page', message: "Already Logged in"});
    } else{
        res.render('login', {title:'Login Page', message: noInput});
    }

    function loginReq(err, result){
        if (err) throw err;
        if(result.length > 0) bcrypt.compare(pass, result[0].hash, passCompare);
        else res.render('login', {title:'Login Page', message: "incorrect input"});
    }

    function passCompare(err, result){
        if(err) throw err;
        if(result){
            DB.query(sqlUserData, [user], (err, result) =>{
                if(err) throw err;
                if(result.length > 0){
                    req.session.loggedIn = true;
                    req.session.username = user;
                    req.session.bm = result[0].bench_max;
                    req.session.sm = result[0].squat_max;
                    req.session.dm = result[0].deadlift_max;
                    req.session.c =  result[0].concept_id;
                    req.session.p =  result[0].program_id;
                    req.session.w =  result[0].week;
                    req.session.d =  result[0].day;
                    usersOnline++;
                    users[user] = true;
                    res.redirect('/');
                } else res.render('login', {title:'Login Page', message: "Error"});
            });
        }
    }
}

export function createAccount(req, res){
    const sqlCheckEmail = `SELECT email FROM users WHERE email=?`;
    const sqlCheckUser = `SELECT username FROM users WHERE username=?;`;
    const sqlQuery = `INSERT INTO users (email, username, hash) VALUES(?, ?, ?)`;
    const statsQuery = `INSERT INTO userstats(user_id)VALUES((SELECT id FROM users WHERE username=?));`;
    const logQuery = `INSERT INTO userexerciselog(user_id)VALUES((SELECT id FROM users WHERE username=?));`;
    const successMsg = "Account Created!";
    const failedMsg = "Please enter your information";

    const user = req.body.user, pass = req.body.pass, email = req.body.email;

    if(email && user && pass){
        DB.query(sqlCheckEmail, [req.body.email],(err, result)=>{
            if(err) throw err;
            if(result.length > 0)
                res.render('accountcreation', {title: "Create Account", message: "Email already in use!"});
            else
            DB.query(sqlCheckUser, [req.body.user], (err, result)=>{
                if(result.length > 0)
                    res.render('accountcreation', {title: "Create Account", message: "Username already in use!"});
                else{
                    bcrypt.hash(pass, salt, createHashedPass);
                    res.render('login', {title: "login", message: successMsg});
                }
            }); 
        });
    }else{
        res.render('accountcreation', {title: "Create Account", message: failedMsg});
        res.end();
    }

    function createHashedPass(err, hash){
        if(err) throw err;
        DB.query(sqlQuery, [email, user, hash], err =>{if(err) throw err;});
        DB.query(statsQuery, [user], err =>{if(err) throw err;});
        DB.query(logQuery, [user], err =>{if(err) throw err;});
    }
}

export function logout(req, res){
    delete users[req.session.username];
    req.session.destroy();
    usersOnline--;
    res.redirect('/login');
    res.end();
}