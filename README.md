[<img width="200" alt="get in touch with Consensys Diligence" src="https://user-images.githubusercontent.com/2865694/56826101-91dcf380-685b-11e9-937c-af49c2510aa0.png">](https://diligence.consensys.net)<br/>
<sup>
[[  🌐  ](https://diligence.consensys.net)  [  📩  ](mailto:diligence@consensys.net)  [  🔥  ](https://consensys.github.io/diligence/)]
</sup><br/><br/>


# VSCode Solidity Contract Flattener

[truffle-flattener](https://www.npmjs.com/package/truffle-flattener) context menu integration for vscode.

Adds a context menu to flatten solidity contracts from truffle projects:
* **NOTE/REQUIRED**: Make sure you've installed truffle and the project's dependencies (`npm install`).
* select files, `right-click` -> `Solidity: flatten selected file(s)` 
* or `cmd + shift + p` -> `Solidity Flattener - flatten current file`.

<img width="360" alt="context-menu" src="https://user-images.githubusercontent.com/2865694/60889644-c99fe880-a259-11e9-95d4-2899826b7d65.png">

### Developers

`truffle-flattener.contextMenu.flatten` can be called by any other extension as following:

* `files` .. an array of files to flatten
* `callback` .. function to be called as `callback(string:filepath, string:truffle-path, string:flattened_contract)` on flatten success
* `showErrors` .. enable or suppress vscode info/error notifications

```js

 vscode.commands.executeCommand("vscode-solidity-flattener.flatten", {files: files, callback:callback, showErrors:showErrors})
        .catch(error =>{
            // command not available
            vscode.window.showWarningMessage("Error running `tintinweb.vscode-solidity-flattener`. Please make sure the extension is installed.\n" + error)
        })
```


## Credits

* [truffle-flattener](https://www.npmjs.com/package/truffle-flattener)


## Release Notes

see [CHANGELOG](./CHANGELOG.md)


-----------------------------------------------------------------------------------------------------------
