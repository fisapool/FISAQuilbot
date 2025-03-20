// Get branding settings via messaging
async function getBrandingSettings() {
  // Default branding settings in case messaging fails
  const defaultSettings = {
    brandColor: "#2563eb",
    extensionName: "FISA QuillBot"
  };

  try {
    // Try to get branding settings from background script
    const response = await chrome.runtime.sendMessage({ type: 'getBranding' }).catch(() => null);
    return response || defaultSettings;
  } catch (error) {
    console.log('Failed to get branding settings:', error);
    return defaultSettings;
  }
}

// Update branding elements
async function updateBranding() {
  const brandSettings = await getBrandingSettings();

  // Add MergeSystemPro branding to QuillBot interface
  const brandingContainer = document.createElement('div');
  brandingContainer.className = 'merge-system-pro-branding';
  brandingContainer.innerHTML = `
    <span>Powered by ${brandSettings.extensionName}</span>
  `;

  // Add branding styles
  const styles = document.createElement('style');
  styles.textContent = `
    .merge-system-pro-branding {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: ${brandSettings.brandColor};
      color: white;
      font-size: 14px;
    }
    /* Hide all variations of the marquee ads */
    marquee[id="marqueeAds"],
    marquee.__web-inspector-hide-shortcut__,
    #marqueeAds,
    .MuiGrid-root.MuiGrid-item marquee,
    .MuiGrid-root.MuiGrid-item.css-koo75d,
    div:has(> marquee[id="marqueeAds"]),
    /* Hide plagiarism checker */
    a[data-testid="dashboard-product-card-plagiarism-checker-sm-md"],
    a[href*="/plagiarism-checker"],
    .css-hey9bw.__web-inspector-hide-shortcut__ {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(styles);

  // Insert branding into QuillBot interface
  const quillbotContainer = document.querySelector('.quillbot-container');
  if (quillbotContainer) {
    quillbotContainer.prepend(brandingContainer);
  }
  
  // Remove ads and unwanted elements
  function removeElements() {
    // Array of selectors to target all elements to remove
    const selectors = [
      'marquee[id="marqueeAds"]',
      '#marqueeAds',
      '.MuiGrid-root.MuiGrid-item.css-koo75d',
      'marquee.__web-inspector-hide-shortcut__',
      // Add plagiarism checker selectors
      'a[data-testid="dashboard-product-card-plagiarism-checker-sm-md"]',
      'a[href*="/plagiarism-checker"]',
      '.css-hey9bw.__web-inspector-hide-shortcut__'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Remove the element and its parent if it's just a container
        if (element.parentElement && element.parentElement.children.length === 1) {
          element.parentElement.remove();
        } else {
          element.remove();
        }
      });
    });
  }

  // Run initially and observe for dynamic content
  removeElements();
  const observer = new MutationObserver(() => {
    removeElements();
  });
  
  // Observe the entire document for changes
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
}

// Load QuillBot script
document.addEventListener("DOMContentLoaded", function() {
  document.body.appendChild(Object.assign(document.createElement("script"), {
    src: "https://ragug.github.io/quillbot-premium-free/quillbot.js",
    async: false
  }));
});

// Initialize branding after page load
window.addEventListener("load", function() {
  updateBranding();
});
