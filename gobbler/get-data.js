var AppScriptUrl = 'https://script.google.com/macros/s/AKfycbwavfMsoFWbD2EfKEo4JJINTwYvKZZSUCRLE7dL5YdmNOCe3-MdffdBl9LlrtiFEmCc/exec';

function getData(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Request was successful
        var response = JSON.parse(xhr.responseText);
        // Handle the response data here
         handleData(response);
         console.log(response);
      } else {
        // Request failed
        console.error('Request failed:', xhr.status);
      }
    }
  };
  xhr.send();
}

// this function prints the data to the HTML page.
function handleData(response) {
  response.sort((a, b) => b.score - a.score); // sort by score
  const topScores = response.slice(0, 10); // top 10 scores

  // get element where scores will be displayed
  var sheetDataElement = document.getElementById("sheetData"); 

  // clear any existing content
  sheetDataElement.innerHTML = '';

  topScores.forEach(function(item, index) {
    // create a new <li> element
    var listItem = document.createElement("li");

    // create and append rank number
    var rankDiv = document.createElement("div");
    rankDiv.className = "rank";
    rankDiv.innerHTML = "#" + (index + 1); 
    listItem.appendChild(rankDiv); 

    // create and append player name
    var nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.innerHTML = item.name;
    listItem.appendChild(nameDiv); 

    // create and append player score
    var scoreDiv = document.createElement("div");
    scoreDiv.className = "score";
    scoreDiv.innerHTML = item.score;
    listItem.appendChild(scoreDiv); 

    // Append the <li> element to the "sheetData" element
    sheetDataElement.appendChild(listItem);
  });
}

// Example usage:
getData(AppScriptUrl);


