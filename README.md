
# VSCode Solidity Contract Flattener

[truffle-flattener](https://www.npmjs.com/package/truffle-flattener) context menu integration for vscode.

Adds a context menu to flatten files to the vscode file explorer: 
* select files, `right-click` -> `Solidity: flatten selected file(s)` 
* or `cmd + shift + p` -> `Solidity Flattener - flatten current file`.

### Developers

`truffle-flattener.contextMenu.flatten` can be called by any other extension providing the following arguments: 
* `clickedFile` - leave empty
* `selectedFiles` - list of files to flatten. will create one new text-editor panel per flattened file.

Let me know if you need any other interfaces.

## Credits

* [truffle-flattener](https://www.npmjs.com/package/truffle-flattener)


## Release Notes

see [CHANGELOG](./CHANGELOG.md)


-----------------------------------------------------------------------------------------------------------
