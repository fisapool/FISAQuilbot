/**
 * FISAQuilbot Premium Content Script
 * Handles dynamic element hiding and UI modifications
 */

// Error logging utility
const logError = (context, error) => {
  console.error(`FISAQuilbot Error (${context}):`, error.message);
};

// Hide advertisement and donation elements
function hideElements() {
  try {
    const elementsToHide = {
      ads: 'marquee#marqueeAds, marquee.__web-inspector-hide-shortcut__',
      donations: 'img[src*="buymeacoffee.com"], img.__web-inspector-hide-shortcut__[alt="Buy Me A Coffee"]'
    };

    Object.entries(elementsToHide).forEach(([type, selector]) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          element.style.setProperty('display', 'none', 'important');
        });
      } catch (err) {
        logError(`hiding ${type} elements`, err);
      }
    });
  } catch (error) {
    logError('hideElements', error);
  }
}

// Hide plagiarism checker elements
function hidePlagiarismChecker() {
  try {
    const plagiarismSelectors = [
      '[data-testid="dashboard-product-card-plagiarism-checker-sm-md"]',
      '.css-hey9bw[href*="plagiarism-checker"]',
      'a[href*="plagiarism-checker"]'
    ];

    plagiarismSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          element.style.display = 'none';
        });
      } catch (err) {
        logError(`hiding plagiarism element (${selector})`, err);
      }
    });
  } catch (error) {
    logError('hidePlagiarismChecker', error);
  }
}

// Initialize observers for dynamic content
function initializeObservers() {
  try {
    const config = { childList: true, subtree: true };
    
    // Observer for ads and donations
    const elementObserver = new MutationObserver(() => {
      try {
        hideElements();
      } catch (err) {
        logError('elementObserver callback', err);
      }
    });

    // Observer for plagiarism elements
    const plagiarismObserver = new MutationObserver(() => {
      try {
        hidePlagiarismChecker();
      } catch (err) {
        logError('plagiarismObserver callback', err);
      }
    });

    // Start observing
    elementObserver.observe(document.body, config);
    plagiarismObserver.observe(document.body, config);
  } catch (error) {
    logError('initializeObservers', error);
  }
}

// Initialize extension
function initializeExtension() {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        hideElements();
        hidePlagiarismChecker();
        initializeObservers();
      });
    } else {
      hideElements();
      hidePlagiarismChecker();
      initializeObservers();
    }
  } catch (error) {
    logError('initializeExtension', error);
  }
}

// Start the extension
initializeExtension(); 