// Content Script
// Injected into web pages to extract data or interact with the DOM

console.log("Bunker Network Content Script Injected.");

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXTRACT_PAGE_DATA') {
    const pageData = {
      title: document.title,
      url: window.location.href,
      content: document.body.innerText.substring(0, 5000) // First 5k chars
    };
    sendResponse(pageData);
  }
});
