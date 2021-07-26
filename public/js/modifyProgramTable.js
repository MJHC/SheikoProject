let exerciseTracker = 0;
let setsTracker = 0;

function nextExercise(){
    const workingTable = document.getElementById("working");
    const doneTable = document.getElementById("done");
    const exercise = workingTable.rows;
    const setsCell = exercise[0].cells[0];
    const doneBtn = document.getElementById("done-btn");
    const currentExercise = document.getElementById("current-exercise");
    const currentSet = document.getElementById("current-set");

    data[exerciseTracker].sets = data[exerciseTracker].sets -1;
    

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
            doneBtn.setAttribute("disabled", "1");

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
    else currentSet.textContent = `${exercise[1].cells[0].innerHTML} ${exercise[1].cells[1].innerHTML}`;

    setsTracker++;

    setsCell.innerHTML = data[exerciseTracker].sets + " Sets";
}
