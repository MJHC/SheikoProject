import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql';

export const DB = mysql.createConnection({
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

export function nextWorkout(req, res){
    const sqlQuery = `
    SELECT MAX(week) AS week, MAX(day) AS day
	FROM exercises
    WHERE program_id IN 
        (SELECT id FROM programs WHERE concept_id =?);`
    if(req.session.loggedIn){
        const currentWeek = req.session.w, currentDay = req.session.d;
        DB.query(sqlQuery,[req.session.c], (err, result) =>{
            if(err) throw err;
            if(result.length >0){
                if(currentDay < result[0].day){
                    updateLog(res, req.session.p, currentWeek, currentDay+1, req.session.username);
                    req.session.d++;
                } else if(currentWeek < result[0].week){
                    updateLog(res, req.session.p, currentWeek+1, 1, req.session.username);
                    req.session.w++; req.session.d = 1;
                }else {
                    updateLog(res, 10, 1, 1, req.session.username);
                    req.session.p = 0; req.session.d = 0; req.session.w = 0;
                }

            }
        });
    }
    else res.status(403).send("No Login");
}

export function updateLog(res, program, week, day, user){
    const sqlQuery = `
    UPDATE userexerciselog
    SET program_id = ?, week = ?, day = ?
    WHERE user_id in (SELECT id FROM users WHERE username = ?);`;

        DB.query(sqlQuery, [program, week, day, user], update);
    
    function update(err, result){
        if(err) throw err;
        else res.redirect('/');
    }
}

export function programs(req, res){
    const sqlQuery = `
    SELECT name FROM programs
	    WHERE concept_id = ?;`

    DB.query(sqlQuery, [req.session.c], (err, result) =>{
        if(err) throw err;
        if(result.length > 0)
            res.send(result);
        else res.status(404).send("No Programs Found");
    })
}

export function changeProgram(req, res){
    const sqlQuery = `SELECT id FROM programs WHERE name = ?;`
    if(req.session.loggedIn)
        DB.query(sqlQuery, [req.body.program], (err, result)=>{
            if(result.length > 0){
                updateLog(res, result[0].id, 1, 1, req.session.username);
                req.session.p = result[0].id;
                req.session.d = 1;
                req.session.w = 1;
            }
        });
    else res.status(403).send("No Login");
}

export function updateStats(req, res){
    const sqlQuery = `
    UPDATE userstats
	    SET bench_max = ?, squat_max = ?, deadlift_max = ?
	    WHERE user_id IN(SELECT id FROM users WHERE username = ?);`;
    
    if(req.session.loggedIn)
        DB.query(sqlQuery, [req.body.bench, req.body.squat, req.body.deadlift, req.session.username], (err, result)=>{
            if(err) throw err;
            else {
                req.session.bm = req.body.bench;
                req.session.sm = req.body.squat;
                req.session.dm = req.body.deadlift;
                res.redirect('/');
            }
        })
}