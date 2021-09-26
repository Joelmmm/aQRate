import { formatUrl, Template } from './utils/utils.js';

chrome.tabs.onActivated.addListener(activeInfo => {
  console.log('activeInfo ', activeInfo);
  return;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_TAB_URL') {

    let activeTab = { url: null };
    let queryOptions = { active: true, currentWindow: true };

    chrome.tabs.query(queryOptions, (tabs) => {
      activeTab = tabs[0];
      sendResponse({ url: activeTab.url });
    });

  } else if (message.type === 'DELETE_FORMAT') {
    const { id } = message.data;
    chrome.storage.sync.get(['templates'], result => {
      const templatesUpdated = result.templates.filter(template => template.id !== id);

      chrome.storage.sync.set({ templates: templatesUpdated }, () => {
        console.log(`%cTemplate with id ${id} has been removed.`, 'color: green');
        sendResponse({ done: true });
      });
    })
  }
  return true;
});


//  ### Save default formats

chrome.runtime.onInstalled.addListener(() => {
  const formattedUrl = formatUrl('🔗');
  const defaultTemplates = [
    new Template('HTML <a>', formattedUrl.toHtmlATag(), 'https://www.w3schools.com/html/html_links.asp'),
    new Template('HTML <img>', formattedUrl.toHtmlImgTag(), 'https://www.w3schools.com/html/html_images.asp'),
    new Template('Markdown Link', formattedUrl.toMarkdownLink(), 'https://www.markdownguide.org/basic-syntax#links'),
    new Template('Markdown Image', formattedUrl.toMarkdownImg(), 'https://www.digitalocean.com/community/tutorials/markdown-markdown-images'),
  ];

  chrome.storage.sync.clear();

  chrome.storage.sync.set({ templates: defaultTemplates }, () => console.log('%cDefault templates saved.', 'color: green'));
});