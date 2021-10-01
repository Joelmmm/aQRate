import "core-js/stable";
import "regenerator-runtime/runtime";
import hash from 'hash-string';
import { validateImage } from 'image-validator';

// request QR code from Google's API
export async function getQR(urlToEncode) {
  const url = 'https://chart.googleapis.com/chart?';
  const imageWidth = 250;
  const imageHeight = 250;
  const data = urlToEncode;

  const requiredParams = ['cht=qr', `chs=${imageWidth}x${imageHeight}`, `chl=${data}`];

  const QRCodeResponse = await fetch(`${url}${requiredParams.join('&')}`);

  if (QRCodeResponse.ok) {
    return QRCodeResponse.blob();
  } else {
    console.error('Request for QR failed.');
  }
  return null
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

export function Template(title, content, referenceURL = '', isImageRelated = false) {
  this.title = title;
  this.content = content;
  this.referenceURL = referenceURL;
  this.id = hash(this.title + this.content);
  this.isImageRelated = isImageRelated;
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

export async function validateImageUrl(url) {
  try {
    const isValidImage = await validateImage(url, { throw: true });
    return isValidImage;
  } catch (error) {
    console.warn(error);
    return false;
  }
};
