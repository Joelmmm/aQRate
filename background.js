console.log('Hello from background script.');

chrome.tabs.onActivated.addListener(activeInfo => {
  console.log('activeInfo ', activeInfo);
  return;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message  ', message);
  if (message.type === 'GET_CURRENT_TAB_URL') {
    console.log('looooooooooool');

    let activeTab = { url: 'shit' };
    let queryOptions = { active: true, currentWindow: true };

    chrome.tabs.query(queryOptions, (tabs) => {
      activeTab = tabs[0];
      sendResponse({ url: activeTab.url });
    });
  }
  return true;
});
