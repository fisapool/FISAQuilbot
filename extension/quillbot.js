document.addEventListener("DOMContentLoaded", function() {
    // Create and append the local script element
    const scriptElement = document.createElement("script");
    scriptElement.src = "scripts/quillbot.js"; // Adjust the path as necessary
    scriptElement.async = false; // Ensure the script loads in order

    // Append the script to the document body
    document.body.appendChild(scriptElement);
});

window.addEventListener("load", function() {
    // Create a container for the button
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "quillbot";
    buttonContainer.className = "quillbot";
    buttonContainer.style.cssText = "display: flex; flex-direction: column; justify-content: space-evenly; position: fixed; z-index: 1203; right: 16px; bottom: 16px;";

    // Create the button with a link
    buttonContainer.innerHTML = `
        <a href="https://www.buymeacoffee.com/ragu2k" target="_blank" id="coffeeButton">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important; width: 217px !important;">
        </a>
    `;

    // Append the button container to the document body
    document.body.appendChild(buttonContainer);

    // Remove the button
    const coffeeButton = document.getElementById("coffeeButton");
    if (coffeeButton) {
        coffeeButton.remove(); // Removes the button from the DOM
    }
});
