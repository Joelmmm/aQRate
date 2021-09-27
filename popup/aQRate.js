import { getQR, handleTemplateInput } from '../utils/utils';
import dragAndDrop from './dragAndDrop';

const QR_ImageTag = document.getElementById('QR-image');
const popupContent = document.getElementById('popup-content');
const donut = document.querySelector('.donut');

// Ask for current's tab URL
chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB_URL' }, async (response) => {
  const { url } = response;

  chrome.storage.sync.get(['templates'], result => {
    if ('templates' in result) {
      for (const template of result.templates) {
        popupContent.appendChild(
          UrlTextFormatComponent(
            template.title,
            handleTemplateInput(template.content, url),
            template.id,
            template.referenceURL
          )
        )
      }
    }
    // Set listeners for drag and drop events.
    const draggables = popupContent.querySelectorAll('.draggable');
    dragAndDrop(draggables, popupContent);
  })

  QR_ImageTag.src = URL.createObjectURL(await getQR(url));

  // After we get the QR: remove donut, add image.
  if (QR_ImageTag.classList.contains('hidden')) {
    QR_ImageTag.classList.remove('hidden');
    donut.classList.add('hidden');
  }

  return
});

// Add-Template button...

const addTemplateButton = document.querySelector('#add-template-button');

addTemplateButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
})

// Components...

function UrlTextFormatComponent(title, formattedUrl, id, externalInfoURL) {

  const container = document.createElement('div');
  const titleElem = document.createElement('a');
  const contentBox = document.createElement('div');
  const contentAndButtonContainer = document.createElement('div');
  const content = document.createElement('span');
  const linkIcon = document.createElement('img');
  // title and info icon wrapper
  const linkContainer = document.createElement('div');

  // associations
  container.appendChild(linkContainer);
  container.appendChild(contentAndButtonContainer);
  linkContainer.appendChild(titleElem);
  linkContainer.appendChild(linkIcon);
  linkContainer.appendChild(DeleteButton());
  contentAndButtonContainer.appendChild(contentBox);
  contentAndButtonContainer.appendChild(CopyButton(formattedUrl));
  contentBox.appendChild(content);
  titleElem.appendChild(document.createTextNode(title));


  // Set attributes
  container.classList.add('format__container');
  container.classList.add('draggable');
  container.id = id;
  container.draggable = true;
  titleElem.className = 'format__title';
  contentBox.className = 'format__content-box';
  content.className = 'format__content';
  contentAndButtonContainer.className = 'format__contentBox-button-container';
  linkIcon.src = chrome.runtime.getURL('../icons/link_black_24dp.svg');
  linkIcon.className = 'format__link-icon';
  titleElem.href = externalInfoURL;
  linkContainer.className = 'format__link-container'

  // Insert formatted Url 
  content.appendChild(document.createTextNode(formattedUrl));

  return container;
}

function CopyButton(textToCopy) {
  const button = document.createElement('button');
  const image = document.createElement('img');

  image.src = chrome.runtime.getURL('../icons/content_copy_black_24dp.svg');
  button.className = 'format__copy-button';

  button.appendChild(image);

  button.addEventListener('click', () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => displayAlert('Copied to clipboard.'),
      (error) => console.error(error)
    );
  })

  return button;
}

// Alert Message. Feedback on copy.

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

function DeleteButton() {
  // create button
  const deleteIcon = document.createElement('img');

  deleteIcon.src = chrome.runtime.getURL('../icons/delete_outline_black_24dp.svg');
  deleteIcon.className = 'format__delete-icon';

  return deleteIcon;
}

popupContent.addEventListener('click', e => {
  if (e.target.classList.contains('format__delete-icon')) {
    const formatContainer = e.target.closest('.format__container');
    const id = formatContainer.id;
    chrome.runtime.sendMessage(
      {
        type: 'DELETE_FORMAT',
        data: { id: (+id) },
      },
      async (response) => {
        if (response.done) formatContainer.remove();
        else console.error('Could not remove format.');
        return;
      }
    )
  }
})


// when popup is closed check the order of format elements
// then send a message to background to save changes in order of elements.
window.addEventListener('unload', () => {
  // get an ordered array of ids 
  const orderArr = [...document.querySelectorAll('.draggable')].map(elem => (+elem.id));  

  chrome.runtime.sendMessage({ type: 'UPDATE_ORDER', data: { order: orderArr } }, () => null);
})