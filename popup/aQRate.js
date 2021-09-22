console.log('Hello from popup script.');
const bg = chrome.extension.getBackgroundPage();

const QR_ImageTag = document.getElementById('QR-image');
const popupContent = document.getElementById('popup-content');
const donut = document.querySelector('.donut');

// Ask for current's tab URL
chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB_URL' }, async (response) => {
  const { url } = response;
  const formattedUrl = formatUrl(url);

  popupContent.appendChild(UrlTextFormatComponent('HTML <a>', formattedUrl.toHtmlATag(), 'https://www.w3schools.com/html/html_links.asp'))
  popupContent.appendChild(UrlTextFormatComponent('HTML <img>', formattedUrl.toHtmlImgTag(), 'https://www.w3schools.com/html/html_images.asp'))
  popupContent.appendChild(UrlTextFormatComponent('Markdown Link', formattedUrl.toMarkdownLink(), 'https://www.markdownguide.org/basic-syntax#links'))
  popupContent.appendChild(UrlTextFormatComponent('Markdown Image', formattedUrl.toMarkdownImg(), 'https://www.digitalocean.com/community/tutorials/markdown-markdown-images'))

  QR_ImageTag.src = URL.createObjectURL(await formattedUrl.toQR());

  // After we get the QR: remove donut, add image.
  if (QR_ImageTag.classList.contains('hidden')) {
    QR_ImageTag.classList.remove('hidden');
    donut.classList.add('hidden');
  }

  return
});

// request QR code from Google's API
async function getQR(urlToEncode) {
  const url = 'https://chart.googleapis.com/chart?';
  const imageWidth = 250;
  const imageHeight = 250;
  const data = urlToEncode;

  const requiredParams = ['cht=qr', `chs=${imageWidth}x${imageHeight}`, `chl=${data}`];

  const QRCodeResponse = await fetch(`${url}${requiredParams.join('&')}`);

  if (QRCodeResponse.ok) {
    console.log('QRCodeResponse Success');
    return QRCodeResponse.blob();
  } else {
    console.error('QRCodeResponse Error');
  }
  return
}

function formatUrl(url) {
  const altText = 'Alt Text';
  return {
    toQR: async () => await getQR(url),

    toHtmlImgTag: () => `<img alt="${altText}" src="${url}" />`,

    toHtmlATag: () => `<a href="${url}"></a>`,

    toFetchJS: () => `fetch('${url}').then(response => console.log(response));`,

    toMarkdownLink: () => `[My Link!](${url})`,

    toMarkdownImg: () => `![${altText}](${url})`,
  }
}

// Components...

function UrlTextFormatComponent(title, formattedUrl, externalInfoURL) {

  const container = document.createElement('div');
  const titleElem = document.createElement('h3');
  const contentBox = document.createElement('div');
  const contentAndButtonContainer = document.createElement('div');
  const content = document.createElement('span');
  const linkIcon = document.createElement('img');
  // title and info icon wrapper
  const linkContainer = document.createElement('a');

  // associations
  container.appendChild(linkContainer);
  container.appendChild(contentAndButtonContainer);
  linkContainer.appendChild(titleElem);
  linkContainer.appendChild(linkIcon);
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

