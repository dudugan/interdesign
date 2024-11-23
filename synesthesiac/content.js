function applyColors(colors){
    const style = document.getElementById("colorifyer-styles") || document.createElement("style");
    style.id = "colorifyer-styles"; 

    // css for each character
    let css = ""; 
    for (const [key, value] of Object.entries(colors)){
        const [type, char] = key.split("-"); 
        if (type === "text"){
            css += `
                span.char-${char} {
                    color: ${value} !important; 
                }
            `; 
        } else if (type === "bg"){
            css += `
                span.char-${char} {
                    background-color: ${value} !important; 
                }
            `; 
        }
    }

    style.innerHTML = css; 
    document.head.appendChild(style); 

    // make each character have a span with its corresponding class
    const traverser = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false); 
    let node;
    while ((node = traverser.nextNode())){
        if (node.parentNode && node.nodeValue.trim()){
            const fragment = document.createDocumentFragment(); 
            node.nodeValue.split("").forEach((char) => {
                const span = document.createElement("span");
                span.textContent = char; 
                span.className = `char-${char.toUpperCase()}`; 
                fragment.appendChild(span); 
            }); 
            node.parentNode.replaceChild(fragment, node); 
        }
    }
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
