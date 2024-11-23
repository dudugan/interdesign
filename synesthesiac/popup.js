// check that DOM loaded before start to make changes
document.addEventListener("DOMContentLoaded", () => {

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
    const container = document.getElementById("selectors-container"); 

    // create selectors from character set
    chrome.storage.sync.get(null, (data) => {
        chars.split("").forEach((char) => {
            const div = document.createElement("div");
            div.classList.add("selector-group");
            div.innerHTML = `
                <label>${char}</label>
                <input type="color" id="text-${char}" value="${data[`text-${char}`] || "#000000"}">
                <input type="color" id="bg-${char}" value="${data[`bg-${char}`] || "#ffffff"}">
            `; 
            container.appendChild(div); 
        }); 

        // apply saved colors to current tab
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {colors: data}); 
        }); 
    }); 

    // load saved colors from storage
    // chrome.storage.sync.get(["textColor", "bgColor"], (data) => {
    //     if (data.textColor) document.getElementById("text-color").value = data.textColor;
    //     if (data.bgColor) document.getElementById("bg-color").value = data.bgColor; 
    // }); 

    document.getElementById("apply-colors").addEventListener("click", (e) => {
        e.preventDefault; 
        const colors = {}; 
        chars.split("").forEach((char) => {
            colors[`text-${char}`] = document.getElementById(`text-${char}`).value;
            colors[`bg-${char}`] = document.getElementById(`bg-${char}`).value;
        }); 
        
        console.log("Colors selected:", { textColor, bgColor });

        // save colors to storage
        chrome.storage.sync.set(colors, () => {
            console.log("Colors saved!"); 
        }); 
    
        // apply the colors
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
                        chrome.tabs.sendMessage(tabs[0].id, {colors});
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