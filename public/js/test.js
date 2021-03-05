// FOR THE MOBILE MENU
const arrow = document.getElementById("arrow");
const menu = document.getElementsByClassName("menu")[0];
let hidden = true;
arrow.addEventListener("click", (e)=>{
  e.preventDefault();
  
  if(hidden){
  menu.classList.add("open");
  hidden = false;
  } else{
    menu.classList.remove("open");
    hidden = true;
  }
});
