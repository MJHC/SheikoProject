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
        DB.query(`SELECT name FROM programs WHERE id =?`,[req.session.p],(err, result)=>{
            if(err) throw err;
            if(result.length > 0){
                res.render('index', {
                    user: req.session.username, 
                    title: "Home Page", 
                    userdata: {
                        b: req.session.bm,
                        s: req. session.sm,
                        d: req.session.dm,
                        program:{
                            p: result[0].name,
                            w: req.session.w,
                            d: req.session.d
                        }
                    }
                }); 
            }
        });
    else res.redirect('/login');
}

export function loginPage(req, res){
    if(!req.session.loggedIn)
        res.render('login', {title: 'Login Page'}); 
    else res.redirect('/');
}

export function login(req, res){
    const sqlQuery = `SELECT username, hash FROM users WHERE username=?`;
    const sqlProgramSetup = 
    `SELECT program_id, week, day, userstats.bench_max, userstats.squat_max, userstats.deadlift_max
    FROM userexerciselog
    INNER JOIN userstats on(userexerciselog.user_id = userstats.user_id)
    WHERE userexerciselog.user_id in (SELECT id FROM users WHERE username = ?);`
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
        if(result.length > 0) bcrypt.compare(pass, result[0].hash, passCompare);
    }

    function passCompare(err, result){
        if(err) throw err;
        if(result){
            DB.query(sqlProgramSetup, [user], (err, result) =>{
                if(err) throw err;
                if(result.length > 0){
                    req.session.loggedIn = true;
                    req.session.username = user;
                    req.session.bm = result[0].bench_max;
                    req.session.sm = result[0].squat_max;
                    req.session.dm = result[0].deadlift_max;
                    req.session.p = result[0].program_id;
                    req.session.w = result[0].week;
                    req.session.d = result[0].day;
                    res.redirect('/');
                } else res.end();
            });
        } else{
            res.send("Incorrect input");
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

export function workout(req, res){
    if(req.session.loggedIn)
        res.render('workout', {title: "Workout"});
    else res.redirect('/login');
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

    DB.query(sqlQuery, [req.session.p, req.session.w, req.session.d], getProgramSQL);

    function getProgramSQL(err, result){
        if(err) throw err;
        if(result.length > 0){
            calculateWeights(result);
            console.table(result);
            res.send(result);
        } else res.send("Error");
    }

    function calculateWeights(res){
        for(let i = 0; i < res.length; i++){
            switch(res[i].name){
                case 'Bench Press':
                    res[i].procent = round5((res[i].procent/100)*req.session.bm); break;
                case 'Squat':             
                    res[i].procent = round5((res[i].procent/100)*req.session.sm); break;
                case 'Deadlift':          
                    res[i].procent = round5((res[i].procent/100)*req.session.dm); break;
                case 'Deadlift to knees':
                    res[i].procent = round5((res[i].procent/100)*req.session.dm); break;
                case 'Rack Pulls':
                    res[i].procent = round5((res[i].procent/100)*req.session.dm); break;
                case 'Deficit Deadlift':
                    res[i].procent = round5((res[i].procent/100)*req.session.dm); break;
                default: return 0;
            }
        }
        function round5(x){
            return Math.ceil(x/5)*5;
        }
    }
}

export function updateLog(req, res){
    const sqlQuery = `
    UPDATE userexerciselog
    SET program_id = ?, week = ?, day = ?
    WHERE user_id in (SELECT id FROM users WHERE username = ?);`;

    if(req.session.loggedIn)
        DB.query(sqlQuery, [req.body.p, req.body.w, req.body.d, req.session.username], update);
    else res.status(403).send("No Login");
    function update(err, result){
        if(err) throw err;
        else res.send({message: "Updated!"});
    }
}


