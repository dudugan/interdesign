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

  // to filter out duplicates
  const uniqueScores = {};
  response.forEach(function(item) {
    if (!uniqueScores[item.name] || uniqueScores[item.name].score < item.score){
      uniqueScores[item.name] = item;
    }
  })

  const topScores = Object.values(uniqueScores).slice(0, 5); // top 5 scores

  // get element where scores will be displayed
  var sheetDataElement = document.getElementById("sheetData"); 

  // clear any existing content
  sheetDataElement.innerHTML = '';

  topScores.forEach(function(item, index) {
    sheetDataElement.innerHTML = item.name + ' - ' + item.score + '<br>'


    
    // // create a new <li> element
    // var listItem = document.createElement("p");

    // // create and append player name
    // var nameDiv = document.createElement("span");
    // nameDiv.className = "name";
    // nameDiv.innerHTML = item.name;
    // listItem.appendChild(nameDiv); 

    // // create and append player score
    // var scoreDiv = document.createElement("span");
    // scoreDiv.className = "score";
    // scoreDiv.innerHTML = ' - ' + item.score;
    // listItem.appendChild(scoreDiv); 

    // // Append the <li> element to the "sheetData" element
    // sheetDataElement.appendChild(listItem);
  });
}

// Example usage:
getData(AppScriptUrl);


