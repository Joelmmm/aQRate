const displayAlert = alertGenerator();

export function UrlTextFormatComponent(title, formattedUrl, id, externalInfoURL) {

  const container = document.createElement('div');
  const titleElem = document.createElement('a');
  const contentBox = document.createElement('div');
  const contentAndButtonContainer = document.createElement('div');
  const content = document.createElement('span');
  // title and delete icon wrapper
  const linkContainer = document.createElement('div');

  // associations
  container.appendChild(linkContainer);
  container.appendChild(contentAndButtonContainer);
  linkContainer.appendChild(titleElem);
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

function DeleteButton() {
  // create button
  const deleteIcon = document.createElement('img');

  deleteIcon.src = chrome.runtime.getURL('../icons/delete_outline_black_24dp.svg');
  deleteIcon.className = 'format__delete-icon';

  return deleteIcon;
}

// Alert Message. Feedback on copy.

export function alertGenerator() {
  function createAlert() {
    const alert = {
      container: document.createElement('div'),
      closeButton: document.createElement('span'),
      strong: document.createElement('strong'),
      content: document.createElement('span')
    }

    alert.container.className = 'alert hidden';
    alert.closeButton.className = 'closebtn';
    alert.closeButton.innerHTML = '&times;';
    alert.strong.innerHTML = 'Success! ';
    alert.content.className = 'alert-content';

    alert.container.appendChild(alert.closeButton);
    alert.container.appendChild(alert.strong);
    alert.container.appendChild(alert.content);

    return alert;
  }

  const alert = createAlert();
  document.body.prepend(alert.container);

  return function (message) {
    if (!alert.container.classList.contains('hidden')) return;
    else {
      alert.content.innerHTML = '';
      alert.content.innerHTML = message;

      alert.container.classList.remove('hidden');

      const hideAlert = () => {
        alert.container.classList.add('hidden');
        alert.closeButton.removeEventListener('click', hideAlert);
      }

      alert.closeButton.addEventListener('click', hideAlert);
      // remove alert from view in 1.5 seconds
      setTimeout(() => hideAlert(), 1500);
    }
  }
}