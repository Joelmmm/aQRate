import { Template } from '../utils/utils';
import { alertGenerator } from '../components/components';
import isUrl from 'is-url-superb';

const displayAlert = alertGenerator();

const templateForm = document.querySelector('form');
const title = templateForm.elements['template-title'];
const content = templateForm.elements['template-content'];
const referenceURL = templateForm.elements['template-reference-url'];
content.value = '🔗';

templateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTemplate = new Template(title.value, content.value, (isUrl(referenceURL.value) ? referenceURL.value : ''))

  chrome.runtime.sendMessage({ type: 'ADD_FORMAT', data: { format: newTemplate } }, response => {
    if (response.done) {
      title.value = '';
      content.value = '🔗';
      referenceURL.value = '';
      displayAlert('Template created.');
    }
  })
});