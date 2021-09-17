console.log('Hello from popup script.');

const anchorTagText = document.getElementById('html-a-tag__content');
const QR_ImageTag = document.getElementById('QR-image');

// Ask for current's tab URL
chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB_URL' }, async (response) => {
  const { url } = response;
  anchorTagText.innerHTML = url;
  QR_ImageTag.src = await getQR(url);
  return
})

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