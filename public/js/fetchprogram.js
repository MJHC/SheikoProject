async function getProgram(){
    const res = await fetch("/load");
    const data = await res.json();
    printProgram(data);
}

function printProgram(data){
    const table = document.getElementById("working");

    for(const exercise of data){
        if(exercise.collection_key == 1){
            const newTitleRow = table.insertRow(-1);
            const titleCell = newTitleRow.insertCell(0);
            const title = document.createTextNode(exercise.name);
            newTitleRow.cells[0].setAttribute('colspan', '3');
            titleCell.appendChild(title);
        }

        const newRow = table.insertRow(-1);
        const sets = newRow.insertCell(0);
        sets.appendChild(newText(exercise.sets + " Sets"));

        const reps = newRow.insertCell(1);
        reps.appendChild(newText(exercise.reps + " Reps"));

        const volume = newRow.insertCell(2);
        if(exercise.procent)
            volume.appendChild(newText(exercise.procent));
    }

    function newText(string){
        return document.createTextNode(string);
    }
}