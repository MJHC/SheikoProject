let exerciseTracker = 0;
let setsTracker = 0;
let data;

getProgram();

/** Fetches program from server */
async function getProgram(){
//async function fetchProgram(programID, week, day){
    //const res = await fetch(`/load?p=${programID}&w=${week}&d=${day}`);
    const res = await fetch("/load");
    const program = await res.json();
    data = program;
    printProgram(program);
}

/** Prints program to table */
function printProgram(program){
    const table = document.getElementById("working");
    const currentExercise = document.getElementById("current-exercise");

    for(const exercise of program){
        if(exercise.ex_list_item == 1) createTitle(table, exercise);
        createExercise(table, exercise);
    }

    currentExercise.textContent = table.rows[0].cells[0].innerHTML;
}

/** Creates title for exercise */
function createTitle(table, exercise){
    const newTitleRow = table.insertRow(-1);
    const titleCell = newTitleRow.insertCell(0);
    const title = document.createTextNode(exercise.name);
    newTitleRow.cells[0].setAttribute('colspan', '3');
    titleCell.appendChild(title);
}

/** Creates exercise under title */
function createExercise(table, exercise){
    const newExerciseRow = table.insertRow(-1);
    const sets = newExerciseRow.insertCell(0);
    sets.appendChild(newText(exercise.sets + " Sets"));

    const reps = newExerciseRow.insertCell(1);
    reps.appendChild(newText(exercise.reps + " Reps"));

    const volume = newExerciseRow.insertCell(2);
    if(exercise.procent)
        volume.appendChild(newText(exercise.procent));
}

function newText(string){
    return document.createTextNode(string);
}

function nextExercise(){
    const workingTable = document.getElementById("working");
    const doneTable = document.getElementById("done");
    const exercise = workingTable.rows;
    const setsCell = exercise[0].cells[0];
    const doneBtn = document.getElementById("done-btn");
    const currentExercise = document.getElementById("current-exercise");
    const currentSet = document.getElementById("current-set");
    const currentLoad = document.getElementById("current-load");

    data[exerciseTracker].sets = data[exerciseTracker].sets -1;
    setsTracker++;

    // If cell is a title cell move it to done table
    if(exercise[0].cells.length === 1){
        const newTitleRow = doneTable.insertRow(-1);
        newTitleRow.innerHTML = exercise[0].innerHTML;
        workingTable.deleteRow(0);
    }

    // If the tracked sets is 0, move the exercise to the done table
    if(data[exerciseTracker].sets <= 0){
        const newRow = doneTable.insertRow(-1);
        newRow.innerHTML = exercise[0].innerHTML;
        newRow.cells[0].innerHTML = setsTracker + " Sets";    
        workingTable.deleteRow(0);

        // If there is no more exercises disable done button
        if(exercise.length <= 0){
            doneBtn.setAttribute("disabled", null);
            return;
        }

        // if there is a title cell below current row move it to the done table.
        if(exercise[0].cells.length === 1){
            const newTitleRow = doneTable.insertRow(-1);
            newTitleRow.innerHTML = exercise[0].innerHTML;
            currentExercise.textContent = exercise[0].cells[0].innerHTML;
            workingTable.deleteRow(0);
        }
        currentLoad.textContent = exercise[0].cells[2].innerHTML;
        exerciseTracker++;
        setsTracker = 0;
    }

    if(exercise[0].cells.length != 1)
        currentSet.textContent = `${data[exerciseTracker].sets} Sets ${data[exerciseTracker].reps} Reps`;
    else currentSet.textContent = `${exercise[1].cells[0].innerHTML} Sets ${exercise[1].cells[1].innerHTML} Reps ${exercise[1].cells[2].innerHTML} kg`;

    setsCell.innerHTML = data[exerciseTracker].sets + " Sets";
}