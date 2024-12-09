document.body.onkeydown = function(keypress_event){
  var key = keypress_event.key.toLowerCase();
  const groupJ = "qwertyuhgfdsazxcvbnj";
  const groupK = "mliopk";
  let headerText = null;
    if (groupJ.includes(key)) {
        headerText = "j";
        document.body.style.backgroundColor = "pink"; 
    } else if (groupK.includes(key)) {
        headerText = "k";
        document.body.style.backgroundColor = "orange"; 
    }
    if (headerText) {
      let header = document.getElementById("key-header");
      if (!header) {
          // Create header element if it doesn't exist
          header = document.createElement("h1");
          header.style.fontSize = "100px"; 
          header.id = "key-header";
          document.body.appendChild(header);
      }
      header.textContent = headerText;
    }
};