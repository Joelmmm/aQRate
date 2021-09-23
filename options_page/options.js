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
      displayAlert('Template created.')
    })
  })
});


function displayAlert(message) {
  const htmlAlert = document.querySelector('.alert');

  if (!htmlAlert.classList.contains('hidden')) return;
  else {
    const messageContainer = document.querySelector('.alert-content');
    messageContainer.innerHTML = '';
    messageContainer.innerHTML = message;

    htmlAlert.appendChild(messageContainer);

    htmlAlert.classList.remove('hidden');

    const closeButton = document.querySelector('.closebtn');

    const hideAlert = () => {
      htmlAlert.classList.add('hidden');
      closeButton.removeEventListener('click', hideAlert);
    }

    closeButton.addEventListener('click', hideAlert);
    // remove alert from view in 1.5 seconds
    setTimeout(() => hideAlert(), 1500);
  }
}