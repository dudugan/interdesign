function applyColors(colors){
    const style = document.getElementById("colorifyer-styles") || document.createElement("style");
    style.id = "colorifyer-styles"; 

    // css for each character
    let css = ""; 
    for (const [key, value] of Object.entries(colors)){
        // escape non-alphanumeric
        const safeChar = key.replace(/[^a-zA-Z0-9]/g, "\\$&");

        // edit background color based on selection
        css += `
                span.char-${safeChar} {
                    background-color: ${value} !important; 
                }
        `; 

        // parse to see if would go better with white or black text
        hex = key.replace('#', '');
        // convert to rgb
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        // get 'luminance'
        const rgbToLuminance = (c) => {
            // yeah i chatgpted this formula
            return (c <= 0.03928) ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        }; 
        // and this one
        const luminance = 0.2126 * rgbToLuminance(r) + 0.7152 * rgbToLuminance(g) + 0.0722 * rgbToLuminance(b);
        // TODO: change threshold?
        let textcolor; 
        if (luminance > 0.5){
            textcolor = '#000000'; 
        } else {
            textcolor = '#ffffff'; 
        }

        // TODO: currently not working, always going to white
        // edit text color to either black or white based on luminance of selection
        css += `
            span.char-${safeChar} {
                color: ${textcolor} !important; 
            }
        `; 
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
        // node.nodeValue.split("").forEach((char) => {
        //     // don't wrap non-alphanumeric characters or spaces
        //     if (char.trim()){
        //         const span = document.createElement("span");
        //         span.textContent = char; 
        //         span.className = `char-${char.toUpperCase().replace(/[^a-zA-Z0-9]/g, "\\$&")}`; 
        //         fragment.appendChild(span); 
        //     } else {
        //         fragment.appendChild(document.createTextNode(char)); 
        //     }
        // });
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
