!function() {
    "use strict";

    async function fetchWithTimeout(url, config) {
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    }

    async function handleRequests(requests) {
        const results = [];
        const errors = [];
        
        // Set a timeout for the entire operation
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout")), 10000)
        );

        // Process each request
        for (const request of requests) {
            try {
                const result = await Promise.race([fetchWithTimeout(request.url, request.config), timeoutPromise]);
                results.push(result);
            } catch (error) {
                errors.push(error.message);
                console.error("Fetch error:", error);
            }
        }

        // Prepare the response
        const response = {
            success: errors.length === 0,
            result: results.length === 1 ? results[0] : results,
            errors: errors.length > 0 ? errors : undefined
        };

        this.sendResponse(response);
    }

    // Listen for messages from the extension
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { method, params } = message;

        // Set the context for the response
        this.sender = sender;
        this.sendResponse = sendResponse;
        this.params = params;

        if (method === "proxyFetch") {
            handleRequests([params]).call(this);
            return true; // Indicate that the response will be sent asynchronously
        }

        sendResponse({ success: false, error: "Unknown method" });
    });
}();
