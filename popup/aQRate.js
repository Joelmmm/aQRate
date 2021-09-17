console.log('Hello from popup script.');

const QR_ImageTag = document.getElementById('QR-image');
const popupContent = document.getElementById('popup-content');

// Ask for current's tab URL
chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB_URL' }, async (response) => {
  const { url } = response;
  // replace (newChild, oldChild)
  const formattedUrl = formatUrl(url);

  popupContent.appendChild(UrlTextFormatComponent('HTML <a>', formattedUrl.toHtmlATag()))
  popupContent.appendChild(UrlTextFormatComponent('HTML <img>', formattedUrl.toHtmlImgTag()))
  popupContent.appendChild(UrlTextFormatComponent('Markdown Link', formattedUrl.toMarkdownLink()))
  popupContent.appendChild(UrlTextFormatComponent('Markdown Image', formattedUrl.toMarkdownImg()))

  QR_ImageTag.src = await formattedUrl.toQR();
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
    return QRCodeResponse.url;
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

function UrlTextFormatComponent(title, formattedUrl) {
  const container = document.createElement('div');
  const titleElem = document.createElement('h3');
  const contentBox = document.createElement('div');
  const content = document.createElement('span');

  // associations
  container.appendChild(titleElem);
  container.appendChild(contentBox);
  contentBox.appendChild(content);

  // Set attributes
  container.className = 'format__container';
  titleElem.className = 'format__title';
  titleElem.appendChild(document.createTextNode(title));
  contentBox.className = 'format__content-box';
  content.className = 'format__content';

  // Insert formatted Url 
  content.appendChild(document.createTextNode(formattedUrl));

  return container;
}