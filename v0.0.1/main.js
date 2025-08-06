/*== HTML ELEMENT GETS ==*/
var clicksElement = document.getElementById('clicks');

/*== FUNCITON DECLARATIONS ==*/
function increment(n){//increases # of clicks by n
  clicks += n;//increases clicks by n
  clicksElement.innerHTML = clicks;//updates clicksElement
}
function hire(){//hires a clicker
  var clickerCost = Math.floor(25*Math.pow(1.1,clickers));//defines clicker cost using an algorithm based on number of currently hired clickers (default 0)
  if (clicks >= clickerCost){//if statement for buying a clicker, if enough clicks are present
    clickers += 1;//increases clickers by one
    clicks -= clickerCost;//removes cost of hiring current clicker
    document.getElementById('clickers').innerHTML = clickers;//updates the number of clickers element
    clicksElement.innerHTML = clicks;//updates the click element
  }
  var nextCost = Math.floor(25*Math.pow(1.1, clickers));//redefines the cost of a clicker, doesn't change if none are bought
  document.getElementById('clickerCost').innerHTML = nextCost;//updates the clickercost element
}
/*== DEFAULT VALUE INITIALIZERS ==*/
var clicks = 0;//declared efault lcick count
var clickers = 0;//declares default clickers count
var clickVal = 1;//declares default manual click value

/*== GAME MECHANICS ==*/
document.getElementById('clicker').addEventListener('click', function(){//adds a listener for MANUAL clicking
  increment(clickVal);//SIAF neccesary, as 'addeventlistener' functions cannot pass arguments
})

window.setInterval(function(){//the game's 'tick' timer, called a heartbeat every second.
  increment(clickers);
}, 1000)

/*== FEATURES DUMP ==*/
/*
remove right click
bigger buttons
add style
*/
