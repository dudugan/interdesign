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

            const colorOptions = [
                { name: 'black', hex: '#000000'}, 
                { name: 'gray', hex: '#696969'}, 
                { name: 'slate gray', hex: '#2f4f4f'}, 
                { name: 'dark slate blue', hex: '#483d8b'}, 
                { name: 'medium slate blue', hex: '#7b68ee'}, 
                { name: 'slate blue', hex: '#6a5acd'}, 
                { name: 'steel blue', hex: '#4682b4'}, 
                { name: 'medium blue', hex: '#0000cd'}, 
                { name: 'bright blue', hex: '#0000ff'}, 
                { name: 'royal blue', hex: '#4169e1'}, 
                { name: 'dark blue', hex: '#00008b'}, 
                { name: 'navy', hex: '#000080'}, 
                { name: 'midnight blue', hex: '#1911970'}, 
                { name: 'indigo', hex: '#4b0082'}, 
                { name: 'blue violet', hex: '#8a2be2'}, 
                { name: 'violet', hex: '#9400d3'}, 
                { name: 'other violet', hex: '#ee82ee'}, 
                { name: 'rebecca purple', hex: '#663399'}, 
                { name: 'bright purple', hex: '#800080'},
                { name: 'medium purple', hex: '#9370db'}, 
                { name: 'dark orchid', hex: '#9932cc'},
                { name: 'orchid', hex: '#da70d6'}, 
                { name: 'pale violet red', hex: '#db7093'}, 
                { name: 'violet red', hex: '#c71585'}, 
                { name: 'magenta', hex: '#8b008b'},
                { name: 'fuchsia', hex: '#ff00ff'},   
                { name: 'crimson', hex: '#dc143c'},  
                { name: 'fire brick', hex: '#b22222'}, 
                { name: 'bright red', hex: '#ff0000'}, 
                { name: 'dark red', hex: '#8b0000'}, 
                { name: 'real maroon', hex: '#800000'}, 
                { name: 'maroon', hex: '#a52a2a'}, 
                { name: 'tomato', hex: '#ff6347'}, 
                { name: 'orange red', hex: '#ff4500'}, 
                { name: 'orange', hex: '#ff8c00'}, 
                { name: 'sienna', hex: '#a0522d'}, 
                { name: 'peru', hex: '#cd853f'}, 
                { name: 'saddle brown', hex: '#8b4513'}, 
                { name: 'goldenrod', hex: '#b8860b'}, 
                { name: 'yellow green', hex: '#9acd32'}, 
                { name: 'lime green', hex: '#32cd32'}, 
                { name: 'olive drab', hex: '#6b8e23'},  
                { name: 'bright green', hex: '#00ff00'}, 
                { name: 'forest green', hex: '#228b22'}, 
                { name: 'dark green', hex: '#006400'}, 
                { name: 'olive', hex: '#808000'}, 
                { name: 'dark olive', hex: '#556b2f'},
                { name: 'sea green', hex: '#238b57'}, 
                { name: 'medium sea green', hex: '#3cb371'}, 
                { name: 'light sea green', hex: '#20b2aa'}, 
                { name: 'teal', hex: '#008080'}, 
                { name: 'turquoise', hex: '#40e0d0'}, 
                { name: 'cyan', hex: '#008b8b'}, 
            ]

            div.innerHTML = `
                <label for="${char}">${char}</label>
                <div class="custom-dropdown" id="${char}">
                    <div class="selected-color">Select Color</div>
                    <div class="dropdown-options">
                        ${colorOptions.map(option => `
                            <div class="dropdown-option" data-value="${option.hex}" style="text-color: ${option.hex};">
                                ${option.name}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `; 

            container.appendChild(div);

            // sync stored states
            // chrome.storage.sync.get([char], (data) => {
            //     const color = data[char] || "#000000";
            //     const selectedColorDiv = div.querySelector(".selected-color");

            //     selectedColorDiv.style.backgroundColor = color; 
            //     selectedColorDiv.style.textContent = color; 

            //     // div.querySelector(`#${char}`).value = color; 
            // }); 
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
            const dropdown = document.getElementById(`${char}`);
            const selectedColor = dropdown.querySelector('.selected-color');
            const options = dropdown.querySelectorAll('.dropdown-option');

            // toggle dropdown visibility
            selectedColor.addEventListener("click", () => {
                dropdown.classList.toggle("open"); 
            });

            options.forEach(option => {
                option.addEventListener("click", () => {
                    const color = option.getAttribute("data-value");
                    selectedColor.style.backgroundColor = color;
                    selectedColor.textContent = option.textContent;

                    // save selected color to storage
                    chrome.storage.sync.get(null, (data) => {
                        data[char] = color;
                        chrome.storage.sync.set(data, () => {
                            console.log(`Saved color for ${char} as ${color}`); 
                        }); 
                    }); 

                    // close dropdown
                    dropdown.classList.remove("open"); 
                }); 
            }); 
            // colors[`${char}`] = document.getElementById(`${char}`).value;
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