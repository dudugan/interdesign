function applyColors(colors){
    const style = document.getElementById("colorifyer-styles") || document.createElement("style");
    style.id = "colorifyer-styles"; 

    // css for each character
    let css = ""; 
    for (const [key, value] of Object.entries(colors)){
        // get character and text/bg type of box
        const [type, char] = key.split("-"); 

        // escape non-alphanumeric
        const safeChar = char.replace(/[^a-zA-Z0-9]/g, "\\$&");

        // create spans for each
        if (type === "text"){
            css += `
                span.char-${safeChar} {
                    color: ${value} !important; 
                }
            `; 
        } else if (type === "bg"){
            css += `
                span.char-${safeChar} {
                    background-color: ${value} !important; 
                }
            `; 
        }
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
        node.nodeValue.split("").forEach((char) => {
            // don't wrap non-alphanumeric characters or spaces
            if (char.trim()){
                const span = document.createElement("span");
                span.textContent = char; 
                span.className = `char-${char.toUpperCase().replace(/[^a-zA-Z0-9]/g, "\\$&")}`; 
                fragment.appendChild(span); 
            } else {
                fragment.appendChild(document.createTextNode(char)); 
            }
        });
        node.parentNode.replaceChild(fragment, node); 
    }); 

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
