function refresh(){//refreshes counter elements on page
  devices.available = devices.space - (devices.occupied.bots + devices.occupied.rented);//updates number of devices and bots
  document.getElementById('clickCounter').innerHTML = clicks.count;//updates clickcount element
  document.getElementById('researchPoints').innerHTML = research.points;//updates research points element
  document.getElementById('researchCost').innerHTML = research.cost;//updates research cost element
  document.getElementById('availableDevices').innerHTML = devices.available;//updates available devices element
  document.getElementById('botsRunning').innerHTML = devices.occupied.bots + devices.occupied.rented;//updates bots running element
}

function increment(n){
  //increment # of clicks by n
  clicks.count += n;
  refresh();
}

document.getElementById('clickButton').addEventListener('click',function(){
  //adds the click listener to the 'click' button to increment by click power for each click
  increment(clicks.power);
  refresh();
});
document.getElementById('researchButton').addEventListener('click',function(){
  //adds a click listener to the 'research' button to purchase a research point
  if (clicks.count >= research.cost){
    clicks.count -= research.cost;
    research.points++;
    research.cost += research.points;
    refresh();
  }
});
document.getElementById('installBotButton').addEventListener('click', function(){
  //adds a listener to 'install bot' button to install a bot manually, for free
  if (devices.available >= 1 && research.points >= 10){
    devices.available--;
    devices.occupied.bots++;
    refresh();
  }
});
document.getElementById('rentBotButton').addEventListener('click', function(){
  //adds a listener to rent a bot that will cost per minute.  if cost is not paid by the minute, your bot license is revoked.
  if(devices.available >= 1 && clicks.count >= 50/*cost of bot*/){
    clicks.count -= 50;
    devices.available--;
    devices.occupied.rented++;
    refresh();
  }
});
document.getElementById('islandButton').addEventListener('click', function(){
  if (clicks.count >= 1000000){
    clicks.count -= 1000000;
    refresh();
  }
});

var clicks = {
  count:0,//amount of clicks
  power:1//number of clicks gained from a manual click
};
var research = {
  points:0,//amount of research
  cost:1//cost of next research
};
var devices = {
  space:1,//total possible amount of devices
  available:1,//amount of available devices
  occupied:{
    bots:0,//manually created bots through research
    rented:0//bots owned through subscription service
  }
}
var timer = 0;//the game's internal minute clock
window.setInterval(function(){
  //count to 60
  if (timer < 60){
    timer++
  }
  else{//at the end of one minute
    if (devices.occupied.rented * 50 > clicks.count){//if you ain't got the cash
    //repo what you can't pay for
    devices.occupied.rented = Math.floor(clicks.count / 50);
    }
    clicks.count -= (devices.occupied.rented * 50)//pay for the rest
    refresh();
    timer = 0;//reset the timer
  }
  //on 60, charge 50 clicks for every rented bot
  increment(devices.occupied.bots + devices.occupied.rented);//increases clicks by total number of bots per second
}, 1000);
