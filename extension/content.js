javascript
/**
 * FISAQuilbot Premium Content Script v2.0
 * Enhanced element management with dynamic detection and performance optimizations
 */

class FISAQuilbotUI {
  constructor() {
    this.observers = [];
    this.config = {
      selectors: {
        ads: [
          'marquee#marqueeAds',
          'div.ad-container',
          'iframe[src*="ads"]',
          'ins.adsbygoogle'
        ],
        donations: [
          'img[src*="buymeacoffee.com"]',
          '[alt*="Buy Me A Coffee"]',
          '[data-testid="donation-banner"]'
        ],
        plagiarism: [
          '[data-testid*="plagiarism"]',
          '[href*="plagiarism-checker"]',
          '.plagiarism-widget',
          '.anti-plagiarism-section'
        ]
      },
      mutationObserver: {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      },
      throttleDelay: 300
    };

    this.initialize();
  }

  // Enhanced logging with stack traces
  logError(context, error) {
    console.error(`[FISAQuilbot][${new Date().toISOString()}] Error in ${context}:`, {
      message: error.message,
      stack: error.stack,
      errorObject: error
    });
  }

  // Throttled function for performance
  throttle(callback, limit) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= limit) {
        callback(...args);
        lastCall = now;
      }
    };
  }

  // Universal element handler
  handleElements(selectors, action = 'hide') {
    try {
      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(element => {
            try {
              if (action === 'hide') {
                element.classList.add('fq-hidden-element');
                element.setAttribute('data-fq-hidden', 'true');
              } else if (action === 'restore') {
                element.classList.remove('fq-hidden-element');
                element.removeAttribute('data-fq-hidden');
              }
            } catch (err) {
              this.logError(`processing ${selector}`, err);
            }
          });
        } catch (err) {
          this.logError(`querySelectorAll ${selector}`, err);
        }
      });
    } catch (error) {
      this.logError('handleElements', error);
    }
  }

  // Mutation observer setup
  createObserver(targetClass) {
    const callback = this.throttle(mutations => {
      try {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            this[targetClass]();
          }
        });
      } catch (error) {
        this.logError('mutationCallback', error);
      }
    }, this.config.throttleDelay);

    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, this.config.mutationObserver);
    this.observers.push(observer);
  }

  // Feature controllers
  manageAds() {
    this.handleElements(this.config.selectors.ads);
  }

  manageDonations() {
    this.handleElements(this.config.selectors.donations);
  }

  managePlagiarism() {
    this.handleElements(this.config.selectors.plagiarism);
  }

  // Initialization sequence
  initializeFeatures() {
    try {
      [this.manageAds, this.manageDonations, this.managePlagiarism].forEach(fn => {
        try {
          fn.call(this);
        } catch (err) {
          this.logError('initialFeatureSetup', err);
        }
      });
    } catch (error) {
      this.logError('initializeFeatures', error);
    }
  }

  setupObservers() {
    try {
      ['manageAds', 'manageDonations', 'managePlagiarism'].forEach(target => {
        this.createObserver(target);
      });
    } catch (error) {
      this.logError('setupObservers', error);
    }
  }

  // Cleanup mechanism
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.handleElements([
      ...this.config.selectors.ads,
      ...this.config.selectors.donations,
      ...this.config.selectors.plagiarism
    ], 'restore');
  }

  // Main initialization
  initialize() {
    try {
      const readyHandler = () => {
        try {
          // Add global styles
          const style = document.createElement('style');
          style.textContent = `
            .fq-hidden-element {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `;
          document.head.appendChild(style);

          this.initializeFeatures();
          this.setupObservers();
        } catch (error) {
          this.logError('DOMContentLoaded handler', error);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', readyHandler);
      } else {
        readyHandler();
      }

      // Add cleanup handler for potential hot-reload
      window.addEventListener('beforeunload', () => this.cleanup());
    } catch (error) {
      this.logError('mainInitialization', error);
    }
  }
}

// Instantiate and export for potential debugging
window.__FISAQuilbot = new FISAQuilbotUI();
