const fs = require('fs');
const path = require('path');

class TransformExtensionManifestPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    const pluginName = TransformExtensionManifestPlugin.name;
    let entries;


    compiler.hooks.entryOption.tap(pluginName, (context, entry) => {
      entries = entry;
    })
    // -----------------------------------------

    compiler.hooks.afterEmit.tapAsync(pluginName, compilation => {
      const assets = compilation.getAssets();
      const MANIFEST_NAME = 'manifest.json';

      fs.readFile(path.resolve(MANIFEST_NAME), 'utf8', (err, data) => {
        if (err) throw err;
        let result;

        function replaceAll(str, searchValue, replaceValue) {
          let re = new RegExp(searchValue, 'gi')
          return str.replace(re, replaceValue);
        }
        // If some of the files used as entry points in webpack-config appears in manifest then update path. 
        for (const entry in entries) {
          entries[entry].import.forEach(item => {
            result = replaceAll(data, item, path.basename(item))
          })
        }
        // update path for HTML files used in manifest.
        assets.forEach(asset => {
          if (/\.html$/i.test(asset.name)) {
            result = replaceAll(result, asset.info.sourceFilename, asset.name);
          }
        })

        fs.writeFile(path.resolve('build', MANIFEST_NAME), result, (error) => {
          if (error)
            console.log(error);
          return;
        })
      });
    })


  }
}

module.exports = TransformExtensionManifestPlugin;