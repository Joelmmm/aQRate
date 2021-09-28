import { getQR, handleTemplateInput } from '../utils/utils';
import dragAndDrop from './dragAndDrop';
import { UrlTextFormatComponent } from '../components/components';

const QR_ImageTag = document.getElementById('QR-image');
const popupContent = document.getElementById('popup-content');
const donut = document.querySelector('.donut');

// Ask for current's tab URL
chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB_URL' }, async (response) => {
  const { url } = response;
  
  chrome.runtime.sendMessage({type: 'GET_TEMPLATES'}, res => {
    if ('templates' in res) {
      for (const template of res.templates) {
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