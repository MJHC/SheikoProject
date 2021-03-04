const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const doneTab = document.getElementById("done");
const doingTab = document.getElementById("doing");
const doingContent = document.getElementById("doing-content");
const doneContent = document.getElementById("done-content");
let done = false;

doneTab.addEventListener('click', ()=>{
  if(!done){
    doneContent.style.display = "block";
    doingContent.style.display = "none";
    done = true;
  }
});

doingTab.addEventListener('click', ()=>{
  if(done){
    doneContent.style.display = "none";
    doingContent.style.display = "block";
    done = false;
  }
});

document.addEventListener('DOMContentLoaded', getXML);


async function getXML(){
  const response = await fetch("xml/sheiko.xml");
  const data = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, "application/xml");
  displayContent(xml);
}


function displayContent(xml){
  const p = urlParams.get('program');
  const w = urlParams.get('week');
  const d = urlParams.get('day');

  const program = xml.getElementsByTagName(p); //program 
  const week = program[0].childNodes[w];       //week 
  const day = week.childNodes[d];              //day
  const exercises = day.childNodes;

  console.log(week.childNodes);

  for(let i = 0; i < exercises.length; i++){
    if(exercises[i].tagName){
      const sets = exercises[i].childNodes;
      generateExercise(exercises[i], false);

      for(let j = 0; j < sets.length; j++)
        if(sets[j].tagName)
          generateExercise(sets[j], true);
    }
  }
}

function generateExercise(item, SR){
  const list = document.getElementById('workout');
  const li = document.createElement('li');
  if(!SR)
    li.textContent = convertExercise(item);
  else
    li.textContent = item.textContent;  
  list.appendChild(li);
}

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