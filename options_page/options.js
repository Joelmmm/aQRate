const bg = chrome.extension.getBackgroundPage();

const templateForm = document.querySelector('form');
const title = templateForm.elements['template-title'];
const content = templateForm.elements['template-content'];
content.value = '🔗';

try {
  chrome.storage.sync.clear();
} catch (e) {
  bg.console.error(e);
}

templateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  chrome.storage.sync.get(['templates'], function (result) {

    const newTemplate = {
      title: title.value,
      content: content.value
    }
    const toSave = result.templates ? [...result.templates, newTemplate] : [newTemplate];

    chrome.storage.sync.set({ templates: toSave }, () => {
      title.value = '';
      content.value = '🔗';
    })
  })
});