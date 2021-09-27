import { alertGenerator } from '../components/components';

const displayAlert = alertGenerator();

const bg = chrome.extension.getBackgroundPage();

const templateForm = document.querySelector('form');
const title = templateForm.elements['template-title'];
const content = templateForm.elements['template-content'];
const referenceURL = templateForm.elements['template-reference-url'];
content.value = '🔗';

templateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  chrome.storage.sync.get(['templates'], function (result) {

    const newTemplate = {
      title: title.value,
      content: content.value,
      referenceURL: validateURL(referenceURL.value) ? referenceURL.value : '',
    }
    const toSave = result.templates ? [...result.templates, newTemplate] : [newTemplate];

    chrome.storage.sync.set({ templates: toSave }, () => {
      title.value = '';
      content.value = '🔗';
      referenceURL.value = '';
      displayAlert('Template created.');
    })
  })
});

function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}