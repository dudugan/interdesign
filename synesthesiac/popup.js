// check that DOM loaded before start to make changes
document.addEventListener("DOMContentLoaded", () => {
    // load saved colors from storage
    chrome.storage.sync.get(["textColor", "bgColor"], (data) => {
        if (data.textColor) document.getElementById("text-color").value = data.textColor;
        if (data.bgColor) document.getElementById("bg-color").value = data.bgColor; 
    }); 

    document.getElementById("apply-colors").addEventListener("click", () => {
        const textColor = document.getElementById("text-color").value; 
        const bgColor = document.getElementById("bg-color").value; 
    
        console.log("Colors selected:", { textColor, bgColor });

        // save colors to storage
        chrome.storage.sync.set({ textColor, bgColor}, () => {
            console.log("Colors saved:", {textColor, bgColor}); 
        }); 
    
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
                        chrome.tabs.sendMessage(tabs[0].id, {textColor, bgColor});
                    }
                )  
            } else {
                console.error("No active tabs found :("); 
            }
        }); 
    }); 

    document.getElementById("reset-colors").addEventListener("click", () => {
        // clear colors frm storage
        chrome.storage.sync.clear(() => {
            console.log("Colors reset");
        }); 

        // reset colors in current tab
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {reset: true}); 
        }); 
    })
})