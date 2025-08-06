document.addEventListener('click', function(){
  //refreshes the window every time you click
  refresh();
}, false);

$('click').addEventListener('click', function(){
  //increments total click count by clicks.power when button is clicked
  increment(clicks.power);
}, false);
