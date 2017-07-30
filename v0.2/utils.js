//Check type of element
function typeOf(o){
  var type = typeof o;
         //If typeof return something different than object then returns it.
	if (type !== 'object'){ 
		return type;
    }     //If it is an instance of the Array then return "array"
    else if (Object.prototype.toString.call(o) === '[object Array]'){
       	return 'array';
    }    //If it is null then return "null"
	 else if(o === null){
       return 'null';
     } //if it gets here then it is an "object"
	 else {
        return 'object'; 
     }
}

//Convert Object Values to String
//Modified to only look for the values in the array
function ob2Str(o) {
  let str = "";
  ["clicks", "research", "devices", "buildings", "timer", "hour"].forEach(function(item, index){
         str += item + " --> ";
        if(typeOf(o[item]) == 'object' ) {
            for(var p in o[item]) {
                str += p + ": " + o[item][p] + ", ";
            }

            str += " || "
        } 
  });

  return str;
}


console.log(ob2Str(window))
