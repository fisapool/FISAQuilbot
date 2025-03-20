javascript
(() => {
    'use strict';

    // Browser API normalization with fallback
    const browserAPI = (() => {
        if (typeof chrome !== 'undefined') return chrome;
        if (typeof browser !== 'undefined') return browser;
        throw new Error('Unsupported browser environment');
    })();

    // Secure script injection with CSP compliance
    const injectScript = () => {
        try {
            const scriptElement = document.createElement('script');
            const nonce = document.querySelector('script[nonce]')?.nonce || '';
            
            // Configure script attributes
            scriptElement.src = browserAPI.runtime.getURL('quillbot.js');
            scriptElement.nonce = nonce;
            scriptElement.async = true;
            scriptElement.defer = true;
            scriptElement.crossOrigin = 'anonymous';

            // Add integrity hash if available
            const version = browserAPI.runtime.getManifest().version;
            scriptElement.integrity = `sha256-${getScriptHash(version)}`;

            // Lifecycle handlers
            scriptElement.onload = () => {
                scriptElement.remove();
                console.debug('QuillBot script injected successfully');
            };

            scriptElement.onerror = (error) => {
                console.error('Script injection failed:', error);
                dispatchErrorEvent('SCRIPT_LOAD_FAILURE', error);
            };

            // Inject with CSP-compatible method
            document.head.appendChild(scriptElement);
        } catch (error) {
            console.error('Script injection error:', error);
            dispatchErrorEvent('INJECTION_ERROR', error);
        }
    };

    // Secure message handler with validation
    const createMessageHandler = () => {
        const validEndpoints = new Set([
            'premiumFeatures',
            'contentProcessing',
            'authValidation'
        ]);

        const handleMessage = async ({ detail }) => {
            try {
                if (!detail || !validEndpoints.has(detail?.type)) {
                    throw new Error('Invalid message format or endpoint');
                }

                const response = await browserAPI.runtime.sendMessage({
                    ...detail,
                    origin: window.location.origin,
                    timestamp: Date.now()
                });

                window.dispatchEvent(new CustomEvent('QuillBot-Premium-Response', {
                    detail: {
                        status: 'success',
                        data: response,
                        requestId: detail?.requestId
                    }
                }));
            } catch (error) {
                console.error('Message handling error:', error);
                dispatchErrorEvent('MESSAGE_PROCESSING_ERROR', error, detail?.requestId);
            }
        };

        return handleMessage;
    };

    // Error handling utilities
    const dispatchErrorEvent = (code, error, requestId) => {
        window.dispatchEvent(new CustomEvent('QuillBot-Premium-Error', {
            detail: {
                status: 'error',
                code,
                message: error.message,
                requestId,
                stack: error.stack?.split('\n').slice(0, 3).join(' | ')
            }
        }));
    };

    // Security helper functions
    const getScriptHash = (version) => {
        // Implementation would use actual hash generation
        return 'YOUR_COMPUTED_SCRIPT_HASH';
    };

    // Initialization sequence
    try {
        // Feature detection
        if (!browserAPI?.runtime?.sendMessage) {
            throw new Error('Missing required browser APIs');
        }

        // Setup message handler with cleanup
        const messageHandler = createMessageHandler();
        window.addEventListener('QuillBot-Premium-Request', messageHandler);
        
        // Add unload cleanup
        window.addEventListener('beforeunload', () => {
            window.removeEventListener('QuillBot-Premium-Request', messageHandler);
            console.debug('Cleaned up event listeners');
        });

        // Start script injection
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectScript);
        } else {
            injectScript();
        }
    } catch (error) {
        console.error('Initialization failed:', error);
        dispatchErrorEvent('INIT_FAILURE', error);
    }
})();
