document.documentElement.style.setProperty("--textcolor", "white");
document.documentElement.style.setProperty("--highlightcolor", "purple");

const style = document.createElement("style");
style.innerHTML = `
    * {
        color: var(--textcolor) !important;
        background-color: var(--highlightcolor) !important; 
    }
`; 

document.head.appendChild(style); 
