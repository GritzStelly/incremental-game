
//
//
//Begin temporary disable hold-click functionality
var keydown = false;
window.addEventListener('keydown', function(){
  keydown = true;
  //keydown = false;
});
window.addEventListener('keyup', function(){
  keydown = false;
});
//End temporary disable enter-click functionality
//
//

var clicks = {
  count:1000000,//amount of clicks
  power:1,//number of clicks gained from a manual click
  total:200,
  worth:0
},
research = {
  points:0,//amount of research
  cost:1//cost of next research
},
devices = {
  total:1,//total devices
  vacant:1,//amount of available devices
  occupied:{
    bots:0,//manually created bots through research
    rented:0//bots owned through subscription service
  }
},
upgrades = {
  disabled: [document.getElementById("holdToClick"), document.getElementById('uninstall')],
  clickPowerLinear:{
    level:0,
    get reqResearch(){
      return Math.ceil(Math.pow(this.level+1, 2.2));
      //return Math.pow(++this.level,2.2);//from teylor feliz
    }
  },//upgrade level of this ability.  determines all other factors based on algorithms in the listeners
  doubleClickPower:{
    level:0,
    cost:500
  },
  holdToClick:false,
  uninstall:false,
  commas:false
},
buildings = {
  purchased:0,
  rented:0
},
hour = 0; //a secondary to the game's internal minute clock.  Keeps track of hours.
timer = 0;//the game's internal minute clock

function delimitNumbers(str) {
  //stolen from chris west
  return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
    return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
  });
}

function increment(n){
  clicks.count += n;
}

function refresh(){//refreshes counter elements on page
  devices.vacant = devices.total - (devices.occupied.bots + devices.occupied.rented);//refreshes the amoutn of vacant bots (this is terrible i hate myself)
  devices.total = devices.vacant + devices.occupied.bots + devices.occupied.rented;//updates number of devices and bots
  document.getElementById('clickCounter').innerHTML = clicks.count;//updates clickcount element
  document.getElementById('researchPoints').innerHTML = research.points;//updates research points element
  document.getElementById('researchCost').innerHTML = research.cost;//updates research cost element
  document.getElementById('availableDevices').innerHTML = devices.vacant;//updates available devices element
  document.getElementById('botsRunning').innerHTML = devices.occupied.bots + devices.occupied.rented;//updates bots running element
  document.getElementById('reqResearchLinearClickPower').innerHTML = upgrades.clickPowerLinear.reqResearch;//updates required research to increase click power
  document.getElementById('clickPower').innerHTML = clicks.power;
  document.getElementById('remainingSpace').innerHTML =  remainingSpace();//adjusts remaining space elemnt based off the amount of buildings + 2 for initial space then subtracted by total devices owned
  document.getElementById('doubleClickPowerCost').innerHTML = upgrades.doubleClickPower.cost;
  if (clicks.total >= 200){upgrades.disabled[0].removeAttribute('disabled');}
  if (upgrades.uninstall){upgrades.disabled[1].removeAttribute('disabled');}
}

function commaRefresh(){//refreshes counter elements on page using comma delimiters
  devices.vacant = devices.total - (devices.occupied.bots + devices.occupied.rented);//refreshes the amoutn of vacant bots (this is terrible i hate myself)
  devices.total = devices.vacant + devices.occupied.bots + devices.occupied.rented;//updates number of devices and bots
  document.getElementById('clickCounter').innerHTML = delimitNumbers(clicks.count);//updates clickcount element
  document.getElementById('researchPoints').innerHTML = delimitNumbers(research.points);//updates research points element
  document.getElementById('researchCost').innerHTML = delimitNumbers(research.cost);//updates research cost element
  document.getElementById('availableDevices').innerHTML = delimitNumbers(devices.vacant);//updates available devices element
  document.getElementById('botsRunning').innerHTML = delimitNumbers(devices.occupied.bots + devices.occupied.rented);//updates bots running element
  document.getElementById('reqResearchLinearClickPower').innerHTML = delimitNumbers(upgrades.clickPowerLinear.reqResearch);//updates required research to increase click power
  document.getElementById('clickPower').innerHTML = delimitNumbers(clicks.power);
  document.getElementById('remainingSpace').innerHTML =  delimitNumbers(remainingSpace());//adjusts remaining space elemnt based off the amount of buildings + 2 for initial space then subtracted by total devices owned
  document.getElementById('doubleClickPowerCost').innerHTML = delimitNumbers(upgrades.doubleClickPower.cost);
  if (clicks.total >= 200){upgrades.disabled[0].removeAttribute('disabled');}
  if (upgrades.uninstall){upgrades.disabled[1].removeAttribute('disabled');}
}

function hack(){
  if (Math.random() > (research.points/75) && devices.occupied.bots > 0){
    return true;
  }//roll for true based on research level//max research level is 100 for no hacks
  else{
    return false;
  }
}
function remainingSpace(){
  //calculates vacant space for devices not yet purchased
  return ((buildings.rented + buildings.purchased) * 4) + 2 - devices.total;
}
/*function uninstallRepo(canAfford){
  //function to remove any bots, rented or installed, from devices in repo buildings, then also removes the now available devices from your posession
  //if there are enough bots
  //only repo the bots
  //if not
  //repo as many bots
  //then cancel the remaining
var cantAfford = buildings.purchased - canAfford;
  if((devices.occupied.bots - canAfford*4+2) >= 0){

  }
  else{

  }
}*/
function removeBotsDevices(n){//n == buildings being removed
  if(devices.vacant <= n*4){
    devices.total-= devices.vacant;
  }
  else{
    devices.total-= devices.vacant*(n*4)
  }
  var toBeRemoved = (n*4) - remainingSpace();//total devices to be removed
  if (toBeRemoved > 0 && devices.occupied.bots + devices.occupied.rented >= 0){//there are any bots
    if (devices.occupied.bots >= toBeRemoved){
      devices.occupied.bots-=toBeRemoved;//remove just bots
    }
    else{
      toBeRemoved -= devices.occupied.bots;
      devices.occupied.bots = 0;
      devices.occupied.rented -= toBeRemoved;
      //remove bots and rented
    }
  }
  devices.total -= toBeRemoved;
}

window.addEventListener('click', function(){
  //refresh();
  if (upgrades.commas){
    commaRefresh();
  }
  else{
    refresh();
  }
});
document.getElementById('clickButton').addEventListener('click',function(){
  //adds the click listener to the 'click' button to increment by click power for each click
  if (devices.vacant > 0){
    if(!keydown || upgrades.holdToClick || clicks.total < 200){
      increment(clicks.power);
      clicks.total++;
      clicks.worth += clicks.total*clicks.power;
    }
  }
});
document.getElementById('researchButton').addEventListener('click',function(){
  //adds a click listener to the 'research' button to purchase a research point
  if (clicks.count >= research.cost){
    if(!keydown || upgrades.holdToClick){
      clicks.count -= research.cost;
      research.points++;
      research.cost += research.points;
    }
  }
});
document.getElementById('installBotButton').addEventListener('click', function(){
  //adds a listener to 'install bot' button to install a bot manually, for free
  if (devices.vacant > 0 && research.points >= 10){
    if(!keydown || upgrades.holdToClick){
      devices.vacant--;
      devices.occupied.bots++;
    }
  }
});
document.getElementById('rentBotButton').addEventListener('click', function(){
  //adds a listener to rent a bot that will cost per minute.  if cost is not paid by the minute, your bot license is revoked.
  if(devices.vacant >= 1 && clicks.count >= 50/*cost of one bot*/){
    if(!keydown || upgrades.holdToClick){
      clicks.count -= 50;
      devices.occupied.rented++;
    }
  }
});
document.getElementById('incrementClickPowerButton').addEventListener('click', function(){
  //adds an event listener to the upgrade to increase click power by 1 (increment)
  if (devices.vacant > 0 && research.points >= upgrades.clickPowerLinear.reqResearch){
    clicks.power++;
    upgrades.clickPowerLinear.level++;

  }
});
document.getElementById('buyDeviceButton').addEventListener('click', function(){
  //adds an event listener to buy another device.
  if (remainingSpace() > 0 && clicks.count >= 200){
    if(!keydown || upgrades.holdToClick){
      clicks.count -= 200;
      devices.total++;
    }
  }
});
document.getElementById('islandButton').addEventListener('click', function(){
  //buy the private island
  if (clicks.count >= 1000000 && !this.disabled){
    clicks.count -= 1000000;
    this.setAttribute('disabled', true);
  }
});
document.getElementById('purchaseBuildingButton').addEventListener('click', function(){
  //code to purchase a building
  if (clicks.count >= 5000){
    if(!keydown || upgrades.holdToClick){
      clicks.count -= 5000;
      buildings.purchased++;
    }
  }
});
document.getElementById('writeUninstallButton').addEventListener('click', function(){
  //event listener to write uninstall button
  if (research.points >= 36 && devices.vacant > 0){
    upgrades.uninstall = true;
    this.setAttribute('disabled', true);
  }
});
document.getElementById('cancelSubButton').addEventListener('click', function(){
  //event listener to cancel a subscription
  if (devices.occupied.rented > 0){
    devices.occupied.rented--;

  }
});
document.getElementById('doubleClickPowerButton').addEventListener('click', function(){
  //event listener to double click power
  if (clicks.count >= upgrades.doubleClickPower.cost && devices.vacant > 0){
    clicks.count -= upgrades.doubleClickPower.cost;
    clicks.power *= 2;
    upgrades.doubleClickPower.cost *= 10;
  }
});
document.getElementById('commaButton').addEventListener('click', function(){
  if (clicks.count >= 10000 && devices.vacant > 0 && !upgrades.commas){
    upgrades.commas = true;
    this.setAttribute('disabled', true);
  }
});

//DISABLED BUTTONS
upgrades.disabled[0].addEventListener('click', function(){//UNLOCK HOLD TO CLICK BUTTON
  //unlock hold to click functionality again
  if (clicks.count >= 250000 && clicks.total >= 200 && devices.vacant > 0 && !upgrades.holdToClick){
    clicks.count-= 250000;
    upgrades.holdToClick = true;
    this.setAttribute('disabled', true);
  }
});
upgrades.disabled[1].addEventListener('click', function(){//UNINSTALL BUTTON
  // uninstall option for bots
  if (devices.occupied.bots > 0 && upgrades.uninstall && devices.vacant >= 0){
    devices.occupied.bots--;
  }
});



window.setInterval(function(){
  //count to 60
  increment(devices.occupied.bots + devices.occupied.rented);//increases clicks by total number of bots per second
  if (timer < 60){
    timer++;
  }
  else{//at the end of one minute
    if (devices.occupied.rented * 50 > clicks.count){//if you ain't got the cash for rented bots
      devices.occupied.rented = Math.floor(clicks.count / 50);//repo what you can't pay for
    }
    clicks.count -= (devices.occupied.rented * 50)//pay for the rest, //on 60, charge 50 clicks for every rented bot
    if (hack()){
      var j = Math.round(Math.random() * devices.occupied.bots);//temporary variable for amount of bots hacked
      function tmpFunct(){
        devices.occupied.bots -= j;
        var statements = ["are down", "were ambushed", "had their tender hearts torn to shreds", "blacked out", "faded", "lost a finger", "went to the hospital", "had loving families", "never thought you would see this"];
        return statements[Math.floor(Math.random()*statements.length)];
      };
      if (devices.occupied.bots > 0 && j > 0){
        console.log("You've been hacked! " + j + " bots "+ tmpFunct());
        //log the hack
      }
    }//try to hack
    timer = 0;//reset the timer
    if (hour < 60){
      hour++;
    }
    else{//at the end of one hour
      /*if ((buildings.purchased * 200) > clicks.count){//the amount of the property tax is more than you can afford
        var canAfford = Math.floor(clicks.count / 200);//number of buildings that you can pay for
        if (devices.total > (canAfford*4)+2){//amount of devices is more than amount of slots that you can afford
          uninstallRepo(canAfford);//uninstall bots that are going to be repod, then repo the devies that held them
        }
        buildings.purchased = canAfford;//repo now empty buildings that you can't pay for
      }
      clicks.count -= buildings.purchased*200;//pay for the remaining buildings*/
      if (buildings.purchased * 200/*Cost of all property tax*/ > clicks.count/*How much you've got*/){
        var cantAfford = buildings.purchased - Math.floor(clicks.count/200);
        if (devices.total > (buildings.purchased-cantAfford)*4+2){//If you have devices in the buildings being reposessed
          removeBotsDevices(cantAfford);//uninstalls rented & installed bots, based on how much room you will have left
        }
        buildings.purchased -= cantAfford;//repos buildings, based on what you can't afford to pay
      }
      clicks.count -= buildings.purchased * 200;//Pay for your properties
      console.log('an hour, '+buildings.purchased+' buildings purchased, '+devices.total+' total devices.');
      hour = 0;
    }
  }  //refresh();//refresh all variables
  if (upgrades.commas){
    commaRefresh();
  }
  else{
    refresh();
  }
}, 1000);
