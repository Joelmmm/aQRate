import { formatUrl, Template } from './utils/utils.js';

const getTemplates = (cb) => chrome.storage.sync.get(['templates'], cb);
const setTemplates = (templates, cb) => chrome.storage.sync.set({ templates: templates }, cb);

chrome.tabs.onActivated.addListener(activeInfo => {
  console.log('activeInfo ', activeInfo);
  return;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message;

  if (type === 'GET_CURRENT_TAB_URL') {

    let activeTab = { url: null };
    let queryOptions = { active: true, currentWindow: true };

    chrome.tabs.query(queryOptions, (tabs) => {
      activeTab = tabs[0];
      sendResponse({ url: activeTab.url });
    });

  }
  else if (type === 'DELETE_FORMAT') {
    const { id } = message.data;

    getTemplates(result => {
      const templatesUpdated = result.templates.filter(template => template.id !== id);
      setTemplates(templatesUpdated, () => {
        console.log(`%cTemplate with id ${id} has been removed.`, 'color: green');
        sendResponse({ done: true });
      })
    })
  }
  else if (type === 'UPDATE_ORDER') {
    getTemplates(result => {
      const sorted = message.data.order.map(itemId => {
        return result.templates.find(template => template.id === itemId)
      })
      setTemplates(sorted, () => console.log('%cFormats order updated', 'color: green'))
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

  setTemplates(defaultTemplates, () => console.log('%cDefault templates saved.', 'color: green'));
});