function nextExercise(){
    const workingTable = document.getElementById("working");
    const doneTable = document.getElementById("done");
    const exercise = workingTable.rows;
    if(exercise[0].cells[0].getAttribute('colspan') > 1){
        const newTitleRow = doneTable.insertRow(-1);
        const newRow = doneTable.insertRow(-1);

        newTitleRow.innerHTML = exercise[0].innerHTML;
        newRow.innerHTML = exercise[1].innerHTML;
        workingTable.deleteRow(0);
        workingTable.deleteRow(0);
    } else{
        const newRow = doneTable.insertRow(-1);
        newRow.innerHTML = exercise[0].innerHTML;
        workingTable.deleteRow(0);
    }
}

function moveTitleExercise(){
    const newTitleRow = doneTable.insertRow(-1);
    const newRow = doneTable.insertRow(-1);

    newTitleRow.innerHTML = exercise[0].innerHTML;
    
    const sets = newRow.insertCell(0);
    sets.appendChild(newText("1 Set"));

    const reps = newRow.insertCell(1);
    reps.textConent = exercise[1].cell(1).textConent;

    const volume = newRow.insertCell(2);
    volume.textConent = exercise[1].cell(2).textConent;

    exercise[1].cell(0).textConent = minusToCell(1, 0, 1);
    
}

function minusToCell(row, cell, number){
    const string = exercise[row].cell(cell).textConent;
    const arr = string.split(" ");
    return parseInt(arr[0], 10) - number + " Sets";
}

function newText(string){
    return document.createTextNode(string);
}