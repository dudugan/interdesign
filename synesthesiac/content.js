function applyColors(colors){
    const style = document.getElementById("colorifyer-styles") || document.createElement("style");
    style.id = "colorifyer-styles"; 

    // css for each character
    let css = ""; 
    // const colorToggle = colors.colorToggle; 

    for (const [key, value] of Object.entries(colors)){
        // escape non-alphanumeric
        const safeChar = key.replace(/[^a-zA-Z0-9]/g, "\\$&");

        // if (colorToggle){
            // edit background color based on selection
            css += `
            span.char-${safeChar} {
                color: ${value} !important; 
                background-color: 'white' !important;
            }
            `;
        // } else {
        //     css += `
        //     span.char-${safeChar} {
        //         background-color: ${value} !important; 
        //         color: 'white' !important;
        //     }
        //     `; 
        // }
    }

    console.log("Created css for each character"); 

    style.innerHTML = css; 
    document.head.appendChild(style); 

    // collect all text nodes first
    const textNodes = []; 
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false); 
    let node;
    while ((node = walker.nextNode())){
        if (node.parentNode && node.nodeValue.trim()){
            textNodes.push(node); 
        }
    }

    // process each text node on its own
    textNodes.forEach((node) => {
        // skip nodes already processed
        if (node.parentNode.tagName === "SPAN") return; 

        const fragment = document.createDocumentFragment(); 
        const words = node.nodeValue.split(/\s+/); 

        words.forEach((word) => {
            const firstChar = word.charAt(0).toUpperCase();
            const span = document.createElement("span");
            span.textContent = word; 
            span.className = `char-${firstChar.toUpperCase().replace(/[^a-zA-Z0-9]/g, "\\$&")}`; 
            fragment.appendChild(span); 

            // add a space after each word except the last
            if (word !== words[words.length - 1]){
                fragment.appendChild(document.createTextNode(" ")); 
            }
        }); 
        node.parentNode.replaceChild(fragment, node); 
    }); 
}

// apply currently stored colors automatically
chrome.storage.sync.get(null, (data) => {
    if (Object.keys(data).length > 0){
        applyColors(data); 
    }
}); 

// update colors when change in popup selector
chrome.runtime.onMessage.addListener((message) => {
    console.log("Message received by content.js:", message); 

    // if see reset message
    if (message.reset){
        const style = document.getElementById("colorifyer-styles");
        if (style) style.remove(); 
        return; 
    } 
    if (message.colors){
        applyColors(message.colors); 
    }
});
