function applyColors(textColor, bgColor){
    document.documentElement.style.setProperty("--textcolor", textColor);
    document.documentElement.style.setProperty("--highlightcolor", bgColor);

    const style = document.getElementById("colorifyer-styles") || document.createElement("style");
    style.id = "colorifyer-styles"; 
    style.innerHTML = `
        * {
            color: var(--textcolor) !important;
            background-color: var(--highlightcolor) !important; 
        }
    `; 

    document.head.appendChild(style);
}

// apply currently stored colors automatically
chrome.storage.sync.get(["textColor", "bgColor"], (data) => {
    if (data.textColor && data.bgColor){
        applyColors(data.textColor, data.bgColor); 
    }
}); 

// update colors when change in popup selector
chrome.runtime.onMessage.addListener((message) => {
    console.log("Message received by content.js:", message); 

    // if see reset message
    if (message.reset){
        const style = document.getElementById("colorifyer-styles");
        if (style) style.remove(); 
    } else {
        const {textColor, bgColor } = message;
        applyColors(textColor, bgColor); 
    }
}); 
