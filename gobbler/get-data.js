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
  sheetDataElement.innerHTML = '<em>highscores:<em><br>';

  topScores.forEach(function(item) {
    sheetDataElement.innerHTML += item.name + ' - ' + item.score + '<br>'
  });
}

// Example usage:
getData(AppScriptUrl);


