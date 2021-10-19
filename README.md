# aQRate
#### Video Demo:  [https://www.youtube.com/watch?v=g6MmTx_rtIk](https://www.youtube.com/watch?v=g6MmTx_rtIk)
#### Description:
Get the current URL as a QR code or formatted in many ways. 

aQRate is a browser extension that works both on Firefox and Chrome (even though in Chrome the QR functionality is built-in) that helps you not to have to copy manually an URL when you want to continue watching something on your smartphone or whatever device that supports reading QR codes.

![image](https://user-images.githubusercontent.com/22090032/136093057-130ae730-3c36-42d8-af7b-07ea59f8a598.png)

### Templates 
It also allows you to create text templates that wrap the current tab's URL.

There are a couple of built in templates which you can copy to clipboard with one click.

![image](https://user-images.githubusercontent.com/22090032/137994033-22517041-6438-4fe0-bb43-8801636813cd.png)

Another nice feature is that you can add your own templates to the extension.

![image](https://user-images.githubusercontent.com/22090032/136094257-e6a94403-0489-4db8-a02e-25e00aa9302b.png)

![image](https://user-images.githubusercontent.com/22090032/136094648-759aa453-81d3-4554-abc0-6d53583ca385.png)

### About the source code
  The most important file in a browser extension is `manifest.json`. In here you declare what are the assets, scripts and permissions your extension will need to work as intended. Noteworthy parts of this project are:
  - `background.js`: Found in root directory. This file handles CRUD operations, sets up the app when installed.
  - `/popup`: This is a set of files containing the HTML, CSS and JavaScript for the UI element we see when we click on the extension's icon on the top right corner of the browser window. The most noteworthy here is `aQRate.js`, this file creates and injects DOM elements to `aQRate.html` producing the views dynamically. Also, from this file we make a request to Google Charts API to generate the QR code.
  - `/options_page`: This is a set of files containing the HTML, CSS and JavaScript for the options page of the extension (where you add new templates). The script in this case simply sends a massage to `background.js` with the new template's info to be stored and adds few logic to the view.
  - `/components/components.js`: Defines DOM elements to be used by `/popup/aQRate.js` or `/options_page/options.js`.
  - `/utils/utils.js`: Defines useful functions such as those to fetch QR code, create the object that holds template's info, validate input...
  - `webpack.config.js`: Defines instructions to [Webpack](https://webpack.js.org/).
  - `babel.config.json`: Defines instructions to [Babel](https://babeljs.io/)
