import { formatUrl, Template, validateImageUrl } from './utils/utils.js';

const getTemplates = (cb) => chrome.storage.sync.get(['templates'], cb);
const setTemplates = (templates, cb) => chrome.storage.sync.set({ templates: templates }, cb);
const getCurrentTab = (cb) => {
  let queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, tabs => cb(tabs[0]));
  return;
}
// check if current tab's url is an image previous to load popup to improve UX.
let isImageURL = false;

chrome.tabs.onActivated.addListener(activeInfo => {
  getCurrentTab(async tab => {
    isImageURL = await validateImageUrl(tab.url);
  });
  return;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message;
  const successResponse = () => sendResponse({ done: true });

  if (type === 'GET_CURRENT_TAB_URL') {
    getCurrentTab(tab => sendResponse({ url: tab.url }));
  }
  else if (type === 'DELETE_FORMAT') {
    const { id } = message.data;

    getTemplates(result => {
      const templatesUpdated = result.templates.filter(template => template.id !== id);
      setTemplates(templatesUpdated, () => {
        console.log(`%cTemplate with id ${id} has been removed.`, 'color: green');
        successResponse();
      })
    })
  }
  else if (type === 'UPDATE_ORDER') {
    getTemplates(result => {
      let hasChanged = false;
      const sorted = message.data.order.map(
        // Check if the current item (an id) matches the id of 
        // the element in the same index that was retrieved from storage.
        (itemId, index) => {
          if (itemId === result.templates[index].id)
            return result.templates[index];
          else {
            hasChanged = true;
            return result.templates.find(template => template.id === itemId);
          }
        }

      );
      // We do not want to reset the templates if it hasn't changed.
      if (hasChanged)
        setTemplates(sorted, () => console.log('%cFormats order updated.', 'color: green'))
    })
  }
  else if (type === 'ADD_FORMAT') {
    getTemplates(result => {
      const { format } = message.data;
      const toSave = result.templates ? [...result.templates, format] : [format];
      setTemplates(toSave, () => {
        console.log(`%cTemplate created successfully. Id: ${format.id}`, 'color: green');
        successResponse();
      });
    })
  }
  else if (type === 'GET_TEMPLATES') {
    getTemplates(result => sendResponse({ templates: result.templates, isImageURL }));
  }
  return true;
});


//  ### Save default formats

chrome.runtime.onInstalled.addListener(() => {
  const formattedUrl = formatUrl('🔗');
  const defaultTemplates = [
    new Template('HTML <a>', formattedUrl.toHtmlATag(), 'https://www.w3schools.com/html/html_links.asp'),
    new Template('HTML <img>', formattedUrl.toHtmlImgTag(), 'https://www.w3schools.com/html/html_images.asp', true),
    new Template('Markdown Link', formattedUrl.toMarkdownLink(), 'https://www.markdownguide.org/basic-syntax#links'),
    new Template('Markdown Image', formattedUrl.toMarkdownImg(), 'https://www.digitalocean.com/community/tutorials/markdown-markdown-images', true),
  ];

  chrome.storage.sync.clear();

  setTemplates(defaultTemplates, () => console.log('%cDefault templates saved.', 'color: green'));
});