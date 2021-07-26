let data =[
    {
        "week": 1,
        "day": 1,
        "name": "Benchpress",
        "collection": 1,
        "collection_key": 1,
        "sets": 1,
        "reps": 5,
        "procent": 50
    },
    {
        "week": 1,
        "day": 1,
        "name": "Benchpress",
        "collection": 1,
        "collection_key": 2,
        "sets": 2,
        "reps": 4,
        "procent": 70
    },
    {
        "week": 1,
        "day": 1,
        "name": "Benchpress",
        "collection": 1,
        "collection_key": 3,
        "sets": 5,
        "reps": 2,
        "procent": 100
    },
    {
        "week": 1,
        "day": 1,
        "name": "Squat",
        "collection": 2,
        "collection_key": 1,
        "sets": 5,
        "reps": 2,
        "procent": 100
    }
]

/*async function getProgram(){
    const res = await fetch("/load");
    const data = await res.json();
    printProgram(data);
}*/

function printTest(data){
    const table = document.getElementById("working");
    const currentExercise = document.getElementById("current-exercise");
    const currentSet = document.getElementById("current-set");

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

    currentExercise.textContent = table.rows[0].cells[0].innerHTML;
    currentSet.textContent = `${table.rows[1].cells[0].innerHTML} ${table.rows[1].cells[1].innerHTML} ${table.rows[1].cells[2].innerHTML} kg`;

    function newText(string){
        return document.createTextNode(string);
    }
}

printTest(data);