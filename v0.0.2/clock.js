refresh();
var spans = document.getElementsByTagName('span');
for (var i=0; i<spans.length; i++){
  if (spans[i].innerHTML == "#"){
    spans[i].className+= 'hash';
  }
}
