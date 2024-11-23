// check that DOM loaded before start to make changes
document.addEventListener("DOMContentLoaded", () => {

    // initialize character list and selectors container
        // TODO: create language selector to vary characters list?
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
    const container = document.getElementById("selectors-container"); 
    const toggle = document.getElementById("toggle"); 

    chrome.storage.sync.get(["colorPickerEnabled"], (data) => {
        const isEnabled = data.colorPickerEnabled !== false; // default to true if undefined
        if (isEnabled){
            toggle.classList.add("toggle-on");
        } else {
            toggle.classList.remove("toggle-on");
        }
        setDropdownState(isEnabled); 
    }); 

    toggle.addEventListener("click", () => {
        const isEnabled = toggle.classList.toggle("toggle-on"); 
        chrome.storage.sync.set({colorPickerEnabled: isEnabled});

        // reset colors in current tab (but don't reset color storage history!)
        if (!isEnabled){
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {reset: true}); 
            });
        }
    });

    // create selectors from character set
    // chrome.storage.sync is a storage area provided by the chrome API consisting of simple key-value pairs
    // execute following stuff once the data has been retrieved from storage and put into the variable 'data'
    chrome.storage.sync.get(null, (data) => {

        // define options for the dropdown
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

        // for each character, create a color selector div
        chars.split("").forEach((char) => {
            // create a div with the class 'selector-group'
            const div = document.createElement("div");
            div.classList.add("selector-group");

            // outline inner html of the dropdown
            div.innerHTML = `
                <label for="${char}">${char}</label>
                <div class="custom-dropdown" id="${char}">
                    <input class="color-search" type="text" placeholder="Search color..." style="display: none;">
                    <div class="selected-color">Select Color</div>
                    <div class="dropdown-options">
                        ${colorOptions.map(option => `
                            <div class="dropdown-option" data-value="${option.hex}" style="color: ${option.hex};">
                                ${option.name}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `; 

            // append this dropdown to the selectors-container
            container.appendChild(div);

            // find dropdown and 'select color' text
            const dropdown = document.getElementById(`${char}`);
            const input = dropdown.querySelector('.color-search'); 
            const selectedColor = dropdown.querySelector('.selected-color');
            const options = dropdown.querySelectorAll('.dropdown-option');

            if (data[char]){
                selectedColor.style.color = data[char];
                selectedColor.textContent = colorOptions.find(option => option.hex === data[char])?.name || 'Select Color'; 
            }

            // toggle dropdown visibility on click of 'select color' text
            selectedColor.addEventListener("click", () => {
                dropdown.classList.toggle("open"); 
                input.style.display = input.style.display === "none" ? "block" : "none";
                input.focus(); // focus on the input field at first when click a dropdown
            });

            input.addEventListener("input", () => {
                const searchTerm = input.value.toLowerCase();
                options.forEach(option => {
                    const text = option.textContent.toLowerCase();
                    // show or hide the options based on search term
                    option.style.display = text.includes(searchTerm) ? '' : 'none'; 
                }); 
            }); 

            // for each dropdown option, add a click event listener to update that dropdown's value and 'select color' text
            options.forEach(option => {
                option.addEventListener("click", () => {
                    // when click an option, change its text color to the hex code, and the text to the color name
                    const color = option.getAttribute("data-value");
                    selectedColor.style.color = color;
                    selectedColor.textContent = option.textContent;

                    // save selected color to storage
                    data[char] = color;
                    // update global data with local data
                    chrome.storage.sync.set(data, () => {
                        console.log(`Saved color for ${char} as ${color}`); 
                    }); 

                    // close dropdown
                    dropdown.classList.remove("open"); 
                    input.style.display = "none"; 
                }); 
            }); 
        }); 

        // initially apply already-saved colors to this tab
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {colors: data}); 
        }); 
    }); 

    // when click Apply Colors
    document.getElementById("apply-colors").addEventListener("click", (e) => {

        const isEnabled = toggle.classList.toggle("toggle-on"); 

        // only do all of this if the extension is actually on
        if (isEnabled){
            // prevent any other actions that would usually occur when clicking this element
            e.preventDefault(); 

            // create dictionary of colors
            // where the key is the character
            // and the value is the hexcode
            const colors = {}; 
            chars.split("").forEach((char) => {
                colors[`${char}`] = document.getElementById(`${char}`).value;
            }); 

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
        }
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