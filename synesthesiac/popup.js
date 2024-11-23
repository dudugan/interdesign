document.getElementById("apply-colors").addEventListener("click", () => {
    const textColor = document.getElementById("text-color").value; 
    const bgColor = document.getElementById("bg-color").value; 

    console.log("Colors selected:", { textColor, bgColor });

    chrome.tabs.query({active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0){
            console.log("Sending message to content.js..."); 

            // make sure script is injected even if page was loaded before extension
            chrome.scripting.executeScript(
                {
                    target: {tabId: tabs[0].id},
                    files: ["content.js"],
                }, 
                () => {
                    chrome.tabs.sendMessage(tabs[0].id, {textColor, bgColor });
                }
            )  
        } else {
            console.error("No active tabs found :("); 
        }
    }); 
}); 