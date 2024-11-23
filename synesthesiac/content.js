// Listen for messages from popup color selector
chrome.runtime.onMessage.addListener((message) => {
    const {textColor, bgColor } = message;

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
}); 
