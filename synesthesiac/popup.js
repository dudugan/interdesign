document.getElementById("apply-colors").addEventListener("click", () => {
    const textColor = document.getElementById("text-color").value; 
    const bgColor = document.getElementById("bg-color").value; 

    chrome.tabs.query({active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {textColor, bgColor });
    }); 
}); 