import * as fs from "fs";
import * as parser from'fast-xml-parser';
import he from "he";

const defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "@", //default is false
    textNodeName : "#text",
    ignoreAttributes : true,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    supressEmptyNode: false,
    tagValueProcessor: a=> he.encode(a, { useNamedReferences: true}),// default is a=>a
    attrValueProcessor: a=> he.encode(a, {isAttributeValue: isAttribute, useNamedReferences: true})// default is a=>a
};

if(fs.existsSync("./sheiko.sql")){
    fs.unlink("./sheiko.sql", err => {if(err) throw err});
}

const file = fs.createWriteStream('./sheiko.sql', {flags: "a"});

file.write("INSERT INTO exercises(program_id, exercise_id, week, day, ex_list, ex_list_item, sets, reps, procent)\n VALUES");


fs.readFile("./sheiko.xml", 'utf8', (err, xml)=>{
    if(err) throw err;
    const programs = parser.parse(xml, defaultOptions);
    convertPrograms(programs);
});

function convertPrograms(json){
    let program = 10, week = 1, day = 1, ex_list = 1, jumped = false;

    file.write("INSERT INTO programs(concept_id, name)\n VALUES\n");
    Object.keys(json).forEach(p =>{
        file.write(`(4, "${p}"),\n`);
    });

    file.write("INSERT INTO exercises(program_id, week, day, exercise_id, ex_list, ex_list_item, sets, reps, procent)\n VALUES\n");
    console.log(json["P29"]["W1"]["D1"]);
    console.log(json["P29"]["W1"]["D1"]["Bench"]);
    console.log(json["P29"]["W1"]["D1"]["Squat"]);
    console.log("--------------------------------\n")

    Object.keys(json).forEach(p => {
        file.write(`/*${p}*/\n`);
        Object.keys(json[p]).forEach(w =>{
            file.write(`/*${w}*/\n`);
            Object.keys(json[p][w]).forEach(d =>{
                file.write(`/*${d}*/\n`);

                Object.keys(json[p][w][d]).forEach(e =>{
                    //if(p === "P29" && w === "W1" && d === "D1"){
                        if(typeof(json[p][w][d][e]) === "string"){
                            const sr = convertStringExercise(e);
                            //console.log("yes");
                            let exercise = `(${program}, ${week}, ${day}, ${convertExercise(e)}, ${ex_list}, 1, ${sr.s}, ${sr.r}, 0), /*${e}//${convertExerciseR(e)}string*/\n`;
                            console.log(exercise);
                            file.write(exercise);
                            ex_list++;
                        }
                    //}
                    

                    Object.values(json[p][w][d][e]).forEach(sr =>{
                        //if(p === "P29" && w === "W1" && d === "D1"){
                
                            const exerciseArr = json[p][w][d][e];
                            

                            if(exerciseArr.length && exerciseArr[exerciseArr.length - 1] === sr){
                                ex_list++;
                                printExercise(program, week, day, e, ex_list, sr);
                                ex_list--;
                                jumped = true;
                            } else{
                                //console.log(isArr);
                                printExercise(program, week, day, e, ex_list, sr);
                                ex_list++;
                                if(jumped){
                                    ex_list++;
                                    jumped = false;
                                }
                            }

                            /*if(typeof(json[p][w][d][e]) === "string"){
                                console.log("yes")
                            }*/

                            console.log(ex_list);
                        //}
                        //printExercise(program, week, day, e, ex_list, sr);
                    });
                });
                day++;
                ex_list = 1;
            });
            week++;
            day = 1;
            file.write(`\n`);
        });
        program++;
        week = 1;
        file.write(`\n`);
    });
}

function printExercise(p, w, d, e, eList, sr){
    const isArr = Object.prototype.toString.call(sr) == '[object Array]';
    console.log(`e_list = ${eList}`)
    if(isArr){
        for(let i = 0; i < sr.length; i++){
            const arr = splitExercise(sr[i]);
            let exercise = `(${p}, ${w}, ${d}, ${convertExercise(e)}, ${eList}, ${i + 1}, ${arr[0]}, ${arr[1]}, ${arr[2]}), /*${e}//${convertExerciseR(e)} array*/\n`;
            console.log(exercise);
            file.write(exercise);
        }
    } else {
        for(let i = 0; i < sr["SR"].length; i++){
            const arr = splitExercise(sr["SR"][i]);
            let exercise = `(${p}, ${w}, ${d}, ${convertExercise(e)}, ${eList}, ${i + 1}, ${arr[0]}, ${arr[1]}, ${arr[2]}), /*${e}//${convertExerciseR(e)} object*/\n`;
            console.log(exercise);
            file.write(exercise);
        }
    }
}

function splitExercise(exercise){
    let arr = exercise.split("x");
    for(let i = 0; i < arr.length; i++)
        arr[i] = parseInt(arr[i]);
    return arr;
}

function convertExercise(name){
    switch(name){
      case "Bench":     return 1;
      case "Squat":     return 2;
      case "DL":        return 3;
      case "Rack":      return 4;
      case "WP":        return 5;
      case "DL2K":      return 6;
      case "FSquat":    return 7;
      case "FDF":       return 8;
      case "GMST":      return 9; 
      case "IB":        return 10; 
      case "Dips":      return 11; 
      case "Lunges":    return 12; 
      case "Abs":       return 13; 
      case "French":    return 14; 
      case "GMSE":      return 15; 
      case "Military":  return 16; 
      case "Hyperext":  return 17; 
      case "Triceps":   return 18; 
      case "BBRow":     return 19; 
      case "WPW":       return 20; 
      case "PSquat":   return 21; 
      case "Chins":     return 22; 
      case "LE":        return 23; 
      case "Comp":      return 24;
      case "DDL":       return 25;
      case "DBPress":   return 26;
      case "LP":        return 12;
      default:          return "ERR";
    }
}

function convertStringExercise(name){
    switch(name){
      case "FDF":       return {s: 5, r:10}; // 5x10
      case "GMST":      return {s:5, r: 5}; // 5x5
      case "IB":        return {s:6, r:4}; // 6x4
      case "Dips":      return {s:5, r:8}; // 5x8
      case "Lunges":    return {s:5, r: 5}; // 5x5
      case "Abs":       return {s:3, r:10}; // 3x10
      case "French":    return {s:5, r: 10}; // 5x10
      case "GMSE":      return {s:5, r: 5}; // 5x5
      case "Military":  return {s:4, r: 5}; // 4x5
      case "Hyperext":  return {s:5, r: 8}; //5x8
      case "Triceps":   return {s:5, r: 10}; // 5x10
      case "BBRow":     return {s:5, r: 8}; // 5x8
      case "WPW":       return {s:5, r: 10}; // 5x10
      case "PSquat":   return {s:5, r: 5}; // 5x5
      case "Chins":     return {s:5, r: 8}; // 5x8
      case "LE":        return {s:5, r: 10}; // 5x10
      case "Comp":      return {s:0, r:0};
      case "WP":        return {s:5, r:10};
      case "DBPress":   return {s:6, r:6};
      case "LP":        return {s:5, r: 5};
      default: 		    return {s:"ERR", r: "ERR"};
    }
  }

  function convertExerciseR(name){
    switch(name){
      case "Bench":     return "Benchpress";
      case "Squat":     return "Squat";
      case "DL":        return "Deadlift";
      case "Rack":      return "Rackpulls";
      case "WP":        return "Wheighted pushups, shoulder wide";
      case "DL2K":      return "Deadlift to knees";
      case "FSquat":    return "Front Squat";
      case "FDF":       return "Flat dumbell flyes"; // 5x10
      case "GMST":      return "Good monrnings, standing"; // 5x5
      case "IB":        return "Incline Bench press"; // 6x4
      case "Dips":      return "Dips"; // 5x8
      case "Lunges":    return "Lunges"; // 5x5
      case "Abs":       return "Abs"; // 3x10
      case "French":    return "Frenchpress"; // 5x10
      case "GMSE":      return "Good mornings, seated"; // 5x5
      case "Military":  return "Military Press"; // 4x5
      case "Hyperext":  return "Hyperextensions"; //5x8
      case "Triceps":   return "Triceps"; // 5x10
      case "BBRow":     return "Barbell rows"; // 5x8
      case "WPW":       return "Weighted pushups, wide"; // 5x10
      case "PSquat":   return "Pistol Squats"; // 5x5
      case "Chins":     return "Chin ups"; // 5x8
      case "LE":        return "Leg Extensions"; // 5x10
      case "Comp":      return "Competition Day!";
      case "DDL":       return "Deficit Deadlift";
      case "DBPress":   return "Dumbbell press";
      case "LP":        return "Lunges"
      default:          return "ERR";
    }
  }