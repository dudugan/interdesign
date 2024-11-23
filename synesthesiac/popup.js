// check that DOM loaded before start to make changes
document.addEventListener("DOMContentLoaded", () => {

    // initialize character list and selectors container
        // TODO: create language selector to vary characters list?
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
    const container = document.getElementById("selectors-container"); 

    // create selectors from character set
    chrome.storage.sync.get(null, (data) => {

        // for each character, create a color selector div
        chars.split("").forEach((char) => {
            const div = document.createElement("div");
            div.classList.add("selector-group");
            div.innerHTML = `
                <label>${char}</label>
                <select id="${char}">
                    <option value="#000000">Black</option>
                    <option value="#ff0000">Red</option>
                    <option value="#00ff00">Green</option>
                    <option value="#0000ff">Blue</option>
                    <option value="#800080">Purple</option>
                    <option value="#fa8072">Salmon</option>
                    <option value="#a52a2a">Maroon</option>
                    <option value="#8a2be2">BlueViolet</option>
                    <option value="#dc143c">Crimson</option>
                    <option value="#008b8b">Cyan</option>
                    <option value="#00008b">DarkBlue</option>
                    <option value="#006400">DarkGreen</option>
                    <option value="#b8860b">Goldenrod</option>
                    <option value="#8b008b">Magenta</option>
                    <option value="#556b2f">DarkOlive</option>
                    <option value="#ff8c00">Orange</option>
                    <option value="#9932cc">DarkOrchid</option>
                    <option value="#8b0000">DarkRed</option>
                    <option value="#483d8b">DarkSlateBlue</option>
                    <option value="#2f4f4f">SlateGray</option>
                    <option value="#9400d3">Violet</option>
                    <option value="#696969">Gray</option>
                    <option value="#b22222">FireBrick</option>
                    <option value="#228b22">ForestGreen</option>
                    <option value="#ff00ff">Fuchsia</option>
                    <option value="#4b0082">Indigo</option>
                    <option value="#20b2aa">LightSeaGreen</option>
                    <option value="#800000">RealMaroon</option>
                    <option value="#32cd32">LimeGreen</option>
                    <option value="#0000cd">MediumBlue</option>
                    <option value="#9370db">MediumPurple</option>
                    <option value="#3cb371">MediumSeaGreen</option>
                    <option value="#7b68ee">MediumSlateBlue</option>
                    <option value="#c71585">VioletRed</option>
                    <option value="#1911970">MidnightBlue</option>
                    <option value="#000080">Navy</option>
                    <option value="#6b8e23">OliveDrab</option>
                    <option value="#808000">Olive</option>
                    <option value="#ff4500">OrangeRed</option>
                    <option value="#da70d6">Orchid</option>
                    <option value="#db7093">PaleVioletRed</option>
                    <option value="#cd853f">Peru</option>
                    <option value="#663399">RebeccaPurple</option>
                    <option value="#4169e1">RoyalBlue</option>
                    <option value="#8b4513">SaddleBrown</option>
                    <option value="#238b57">SeaGreen</option>
                    <option value="#a0522d">Sienna</option>
                    <option value="#6a5acd">SlateBlue</option>
                    <option value="#4682b4">SteelBlue</option>
                    <option value="#008080">Teal</option>
                    <option value="#ff6347">Tomato</option>
                    <option value="#ffff00">Yellow</option>
                    <option value="#9acd32">YellowGreen</option>
                    <option value="#ee82ee">Violet</option>
                    <option value="#40e0d0">Turquoise</option>
                </select>
            `; 
            // previously in there^:
            // ```<input type="color" id="${char}" value="${data[`${char}`] || "#000000"}">```

            // sync stored states
            chrome.storage.sync.get([char], (data) => {
                const color = data[char] || "#000000";
                div.querySelector(`#&{char}`).value = color; 
            })

            container.appendChild(div); 
        }); 

        // apply saved colors to current tab?
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {colors: data}); 
        }); 
    }); 

    document.getElementById("apply-colors").addEventListener("click", (e) => {
        // prevent any other actions that would usually occur when clicking this element
        e.preventDefault(); 

        // create dictionary of colors
        // where the key is the character
        // and the value is the hexcode
        const colors = {}; 
        chars.split("").forEach((char) => {
            colors[`${char}`] = document.getElementById(`${char}`).value;
        }); 

        // const colorToggle = document.getElementById("toggle").checked; 
        // colors.colorToggle = colorToggle; // TODO: (how) does this work??

        console.log("Colors selected");

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
}); 