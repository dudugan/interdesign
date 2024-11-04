document.body.onkeydown = function(keypress_event){
  var key = keypress_event.key;
  document.getElementById("key_display").innerHTML = key;
};