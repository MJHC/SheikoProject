const queryString = window.location.search;
const urlParams   = new URLSearchParams(queryString);

// Max 
const bmax = parseInt(urlParams.get('bmax'));
const smax = parseInt(urlParams.get('smax'));
const dmax = parseInt(urlParams.get('dmax'));

// Tabs and workout content
const doneTab      = document.getElementById("tab-done");
const doingTab     = document.getElementById("tab-doing");
const doingContent = document.getElementById("doing-content");
const doneContent  = document.getElementById("done-content");

// Text 
const cLift   = document.getElementById("current-lift");
const cLiftKG = document.getElementById("current-lift-KG");
const cLiftSR = document.getElementById("current-lift-SR");


// Buttons 
const nextBtn = document.getElementById("nextBtn");

let done = false;


document.addEventListener('DOMContentLoaded', ()=>{



})










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