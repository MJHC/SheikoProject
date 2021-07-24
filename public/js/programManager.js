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

