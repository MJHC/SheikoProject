const arrow = document.getElementById("arrow");
const menu = document.getElementById("sidePanel");
let hid = true;
arrow.addEventListener("click", (e)=>{
  e.preventDefault();

  if(hid){
  menu.style.height = 500 + "px";
  hid = false;
  }else{
  menu.style.height = 10 + "vh";
    hid = true;
  }
});