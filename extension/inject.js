(() => {
    // Ensure compatibility between Chrome and other browsers
    const browserAPI = window.chrome ?? window.browser;

    // Create and inject the script element
    const scriptElement = document.createElement("script");
    scriptElement.src = browserAPI.runtime.getURL("quillbot.js");

    // Remove the script element after it has loaded
    scriptElement.onload = () => {
        scriptElement.remove();
    };

    // Prepend the script to the document
    document.documentElement.prepend(scriptElement);

    // Event listener for handling QuillBot messages
    const handleQuillBotMessage = async ({ detail }) => {
        try {
            const response = await browserAPI.runtime.sendMessage(detail);
            window.dispatchEvent(new CustomEvent("QuillBot-Premium-Crack-Receive", { detail: response }));
        } catch (error) {
            console.error("Error sending message to QuillBot:", error);
        }
    };

    // Add the event listener
    window.addEventListener("QuillBot-Premium-Crack-Send", handleQuillBotMessage, false);

    // Optional: Cleanup the event listener when it's no longer needed
    // window.removeEventListener("QuillBot-Premium-Crack-Send", handleQuillBotMessage);
})();
