function $(id){
  //jQuery simulator
  return document.getElementById(id);
}

function refresh(){
  //refreshes the values
  $('clickCount').innerHTML = clicks.count;//amount of clicks
  $('clickPower').innerHTML = clicks.power;//amount of clicks per click
}

function increment(n){
  //increments click total by n
  clicks.count+= n;
}
