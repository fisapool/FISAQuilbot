javascript
(function() {
    "use strict";

    async function fetchWithTimeout(url, config, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { ...config, signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async function handleRequests(requests, sendResponse) {
        const results = [];
        const errors = [];

        for (const request of requests) {
            try {
                const data = await fetchWithTimeout(request.url, request.config);
                results.push(data);
            } catch (error) {
                errors.push(`[${request.url}]: ${error.message}`);
            }
        }

        sendResponse({
            success: errors.length === 0,
            results: results,
            errors: errors.length > 0 ? errors : undefined
        });
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.method === "proxyFetch") {
            handleRequests([message.params], sendResponse);
            return true; // Keep async response
        }
        sendResponse({ success: false, error: "Unknown method" });
    });
})();
