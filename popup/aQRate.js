import { getQR, handleTemplateInput } from '../utils/utils';

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
            template.referenceURL
          )
        )
      }
    }
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

function UrlTextFormatComponent(title, formattedUrl, externalInfoURL) {

  const container = document.createElement('div');
  const titleElem = document.createElement('h3');
  const contentBox = document.createElement('div');
  const contentAndButtonContainer = document.createElement('div');
  const content = document.createElement('span');
  const linkIcon = document.createElement('img');
  const deleteIcon = document.createElement('img');
  // title and info icon wrapper
  const linkContainer = document.createElement('a');

  // associations
  container.appendChild(linkContainer);
  container.appendChild(contentAndButtonContainer);
  linkContainer.appendChild(titleElem);
  linkContainer.appendChild(linkIcon);
  linkContainer.appendChild(deleteIcon);
  contentAndButtonContainer.appendChild(contentBox);
  contentAndButtonContainer.appendChild(CopyButton(formattedUrl));
  contentBox.appendChild(content);
  titleElem.appendChild(document.createTextNode(title));


  // Set attributes
  container.className = 'format__container';
  titleElem.className = 'format__title';
  contentBox.className = 'format__content-box';
  content.className = 'format__content';
  contentAndButtonContainer.className = 'format__contentBox-button-container';
  linkIcon.src = chrome.runtime.getURL('../icons/link_black_24dp.svg');
  linkIcon.className = 'format__link-icon';
  deleteIcon.src = chrome.runtime.getURL('../icons/delete_outline_black_24dp.svg');
  deleteIcon.className = 'format__delete-icon';
  linkContainer.href = externalInfoURL;
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
