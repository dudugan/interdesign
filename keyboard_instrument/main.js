document.body.onkeydown = function(keypress_event){
  var key = keypress_event.key;
  if (key == "r"){
    document.body.style.backgroundColor = "pink"; 
  } else if (key == "g"){
    document.body.style.backgroundColor = "orange"; 
  }
  var new_element = document.createElement("h1"); 
  new_element.innerHTML = key; 
  new_element.classList.add("example_class"); 
  new_element.style.fontSize = "100px"; 
  document.body.appendChild(new_element); 
};

// change image source
