// Background Service Worker (Manifest V3)
// Handles cross-origin requests, context menus, and background AI tasks.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Bunker Network Extension Installed.");
  
  chrome.contextMenus.create({
    id: "analyze-text",
    title: "Analyze Selection in Bunker",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-text" && info.selectionText) {
    // Send to content script or open popup
    chrome.storage.local.set({ pendingAnalysis: info.selectionText }, () => {
      chrome.action.openPopup();
    });
  }
});

// Message listener for Content Script <-> Background <-> UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SYNC_TACTICAL_STATE') {
    // Handle state sync if needed
    sendResponse({ status: 'synced' });
  }
});
