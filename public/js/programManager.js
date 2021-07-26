let exerciseTracker = 0;
let setsTracker = 0;

/** Fetches program from server */
async function fetchProgram(programID, week, day){
    const res = await fetch(`/load?p=${programID}&w=${week}&d=${day}`);
    const data = await res.json();
    printProgram(data);
}

/** Prints program to table */
function printProgram(data){
    const table = document.getElementById("working");

    for(const exercise of data){
        if(exercise.collection_key == 1) createTitle(table);
        createExercise(table, exercise);
    }
}

/** Creates title for exercise */
function createTitle(table){
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

    data[exerciseTracker].sets = data[exerciseTracker].sets -1;
    setsTracker++;

    if(exercise[0].cells.length === 1){
        const newTitleRow = doneTable.insertRow(-1);
        newTitleRow.innerHTML = exercise[0].innerHTML;
        workingTable.deleteRow(0);
    }

    if(data[exerciseTracker].sets <= 0){
        const newRow = doneTable.insertRow(-1);
        newRow.innerHTML = exercise[0].innerHTML;
        newRow.cells[0].innerHTML = setsTracker + " Sets";    
        workingTable.deleteRow(0);

        if(exercise.length <= 0){
            doneBtn.setAttribute("disabled", null);
            return;
        }

        if(exercise[0].cells.length === 1){
            const newTitleRow = doneTable.insertRow(-1);
            newTitleRow.innerHTML = exercise[0].innerHTML;
            currentExercise.textContent = exercise[0].cells[0].innerHTML;
            workingTable.deleteRow(0);
        }
        
        exerciseTracker++;
        setsTracker = 0;
    }

    if(exercise[0].cells.length != 1)
        currentSet.textContent = `${data[exerciseTracker].sets} Sets ${data[exerciseTracker].reps} Reps ${data[exerciseTracker].procent} kg`;
    else currentSet.textContent = `${exercise[1].cells[0].innerHTML} Sets ${exercise[1].cells[1].innerHTML} Reps ${exercise[1].cells[2].innerHTML} kg`;

    setsCell.innerHTML = data[exerciseTracker].sets + " Sets";
}