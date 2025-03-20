!function(){"use strict";async function s(s){const e=[],t=[];setTimeout((()=>this.sendResponse({success:!1,error:"Timeout"})),1e4);for(const n of s)try{e.push(await n)}catch(s){t.push(s),console.log(s)}const n={};t.length>0?(1===t.length?n.error=t[0]:n.errors=t,n.success=!1):(1===e.length?n.result=e[0]:n.results=e,n.success=!0),this.sendResponse(n)}async function e(){const{url:s,config:e}=this.params;return await(await fetch(s,e)).text()}chrome=chrome??browser,chrome.runtime.onMessage.addListener((function(t,n,r){const{method:o,params:c}=t;if(this.sender=n,this.sendResponse=r,this.params=c,"proxyFetch"===o)return s.call(this,[e.call(this)]),!0;r({success:!1,error:"Unknown method"})}))}();

// Branding constants
const BRANDING = {
  extensionName: "FISA QuillBot",
  version: "2.0.0",
  brandColor: "#2563eb"
};

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('MergeSystemPro QuillBot installed with settings:', BRANDING);
});

// Message handler for getting branding info
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'getBranding') {
    sendResponse(BRANDING);
    return true; // Keep the message channel open for async response
  }
});
