// Getting and displaying XML \\
async function getXML(){
  const response = await fetch("xml/sheiko.xml");
  const data = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, "application/xml");
  displayProgram(xml);
}

function displayProgram(xml){
  const p = urlParams.get('program');
  const w = urlParams.get('week');
  const d = urlParams.get('day');

  const program = xml.getElementsByTagName(p); //program 
  const week = program[0].childNodes[w];       //week 
  const day = week.childNodes[d];              //day
  const exercises = day.childNodes;

  let last = "";

  for(let i = 0; i < exercises.length; i++){
    if(exercises[i].tagName){
      const sets = exercises[i].childNodes;
      generateExercise(exercises[i], false, last);
      last = exercises[i].tagName;

      for(let j = 0; j < sets.length; j++)
        if(sets[j].tagName)
          generateExercise(sets[j], true, last);
    }
  }
}

function generateExercise(item, SR, last){
  const list = document.getElementById('workout');
  const li = document.createElement('li');

  if(!SR){
    li.textContent = convertExercise(item);
  } else{
    const string = item.textContent;
    let arr = string.split("x");
    arr[2] = parseInt(arr[2]);

    li.textContent = `${arr[0]} Sets ${arr[1]} Reps ${calcExercise(arr[2], last)} KG`;  

  }
  list.appendChild(li);
}

// for the sheiko programs
function convertExercise(name){
  switch(name.tagName){
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
    case "PSquats":   return "Pistol Squats"; // 5x5
    case "Chins":     return "Chin ups"; // 5x8
    case "LE":        return "Leg Extensions"; // 5x10
    case "Comp":      return "Competition Day!";
    default:          return name.tagName;
  }
}

function calcExercise(arr, last){
  switch(last){
    case "Bench": if(bmax) return (arr/100)*bmax; return arr;
    case "Squat": if(smax) return (arr/100)*smax; return arr;
    case "DL":    if(dmax) return (arr/100)*dmax; return arr;
    default: return "error";
  }
}

// Getting and displaying JSON \\ 
async function getJSON(){
  const response = await fetch("xml/allprograms.json");
  const data = await response.json();
  displayProgramList(data);
}

function displayProgramList(data){
  const prog = data.programs;
  const xml = data.xmlname;
  const select = document.getElementById("programs");
  for(let i = 0; i < prog.length; i++){
    const option = document.createElement("option");
    option.setAttribute("value", xml[i]);
    option.innerHTML = prog[i];
    select.appendChild(option);
  }
}