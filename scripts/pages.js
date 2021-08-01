import {DB} from './easyData.js';
import { usersOnline } from './account.js';

export function loginPage(req, res){
    if(!req.session.loggedIn)
        res.render('login', {title: 'Login Page'}); 
    else res.redirect('/');
}

export function createAccountPage(req, res){
    if(!req.session.loggedIn)
        res.render('accountcreation', {title: "Create Account"});
    else res.redirect('/');
}

export function homePage(req, res){
    const sqlQuery = `
    SELECT concepts.name AS cname, programs.name 
        FROM programs
        INNER JOIN concepts on (programs.concept_id = concepts.id)
        WHERE programs.id = ?;`;
    if(req.session.loggedIn)
        DB.query(sqlQuery,[req.session.p],(err, result)=>{
            if(err) throw err;
            if(result.length > 0){
                res.render('index', {
                    user: req.session.username, 
                    title: "Home Page", 
                    online: usersOnline,
                    userdata: {
                        b: req.session.bm,
                        s: req. session.sm,
                        d: req.session.dm,
                        program:{
                            c: result[0].cname,
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

export function workoutPage(req, res){
    if(req.session.loggedIn)
        res.render('workout', {title: "Workout"});
    else res.redirect('/login');
}

export function editorPage(req,res){
    if(req.session.loggedIn)
        res.render('programeditor', {title: "Editor"});
    else res.redirect('/login');
}