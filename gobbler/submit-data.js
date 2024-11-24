function submitScore(tagName, highScore){
    const data = new URLSearchParams();
    data.append("name", tagName);
    data.append("score", highScore);

    const scriptURL = "https://script.google.com/macros/s/AKfycbwavfMsoFWbD2EfKEo4JJINTwYvKZZSUCRLE7dL5YdmNOCe3-MdffdBl9LlrtiFEmCc/exec";

    // send POST request to apps script endpt
    fetch(scriptURL, {
        method: "POST",
        body: data,
    })
    .then((response) => response.text()) // convert response to text
    .then((data) => {
        console.log("Success:", data);
        alert("Your score has been submitted!");
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("There was an error submitting your score :(");
    }); 
}