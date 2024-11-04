// can save a javascript file to bookmarks
// will run on any page if u click it


// all text is highlighted in black until u hover over it
(() => {
    const style = document.createElement('style');
    style.innerHTML = `
        p {
            color: white;
        }
        p:hover {
            color: black;
        }
    `;
    document.head.appendChild(style);
})();