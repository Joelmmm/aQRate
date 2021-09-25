// request QR code from Google's API
export async function getQR(urlToEncode) {
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

export function formatUrl(url) {
  const altText = 'Alt Text';
  return {
    plain: () => url,

    toQR: async () => await getQR(url),

    toHtmlImgTag: () => `<img alt="${altText}" src="${url}" />`,

    toHtmlATag: () => `<a href="${url}"></a>`,

    toFetchJS: () => `fetch('${url}').then(response => console.log(response));`,

    toMarkdownLink: () => `[My Link!](${url})`,

    toMarkdownImg: () => `![${altText}](${url})`,
  }
}

export function Template(title, content, referenceURL = '') {
  this.title = title;
  this.content = content;
  this.referenceURL = referenceURL;
}
 
// Insert URL into template
export function handleTemplateInput(str, url) {
  if (!str) return url;
  if (typeof str !== 'string') {
    console.error('Argument must be a string.');
    return '';
  }

  let template = str.trim();
  const placeholder = '🔗';

  return template.replaceAll(placeholder, url);
}