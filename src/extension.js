/** 
 * @author github.com/tintinweb
 * @license MIT
 * 
  * */


/** imports */
const vscode = require("vscode")
const truffleFlattener = require("truffle-flattener")
const findUp = require("find-up")
var path = require('path');

/** global vars */
const LANGID = 'solidity'
const EXTENSION_PREFIX = 'truffle-flattener'

const config = vscode.workspace.getConfiguration(EXTENSION_PREFIX);

/** classdecs */


/** funcdecs */

function newWindowBeside(content){
    vscode.workspace.openTextDocument({content: content, language: LANGID})
        .then(doc => vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside))
}

function isSubpath(parent, dir){
    const relative = path.relative(parent, dir);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}


/** event funcs */
function onActivate(context) {
    
    context.subscriptions.push(
        vscode.commands.registerCommand(EXTENSION_PREFIX + '.activeFile.flatten', (args) => {

            let activeFile = vscode.window.activeTextEditor.document.fileName
            if(activeFile.endsWith(".sol")){
                findUp(["truffle.js", "truffle-config.js"],{"cwd":path.dirname(activeFile)}).then(tpath => {
                    if(!isSubpath(vscode.workspace.rootPath, tpath)){
                        vscode.window.showErrorMessage('[Flatten failed] ' + x + "\n" + "The contract does not appear to be part of a truffle project.")
                        return;
                    }
                    
                    truffleFlattener([activeFile], path.dirname(tpath)).then(res => newWindowBeside(res)).then( () => {
                        vscode.window.showInformationMessage('[Flatten success] ' + activeFile)
                    }).catch(ex => {
                        vscode.window.showErrorMessage('[Flatten failed] ' + activeFile + "\n" + ex.message + "\n\n" + "NOTE: Please make sure to run `npm install` in the truffle project dir.")
                        console.error(ex)
                    })
                })
            }
        })
    )

    context.subscriptions.push(
        vscode.commands.registerCommand(EXTENSION_PREFIX + '.contextMenu.flatten', async (clickedFile, selectedFiles) => {

            selectedFiles.map(x => x.path).filter(x => x.endsWith(".sol")).forEach(x => {
                findUp(["truffle.js", "truffle-config.js"],{"cwd":path.dirname(x)}).then(tpath => {
                    if(!isSubpath(vscode.workspace.rootPath, tpath)){
                        vscode.window.showErrorMessage('[Flatten failed] ' + x + "\n" + "The contract does not appear to be part of a truffle project.")
                        return;
                    }

                    truffleFlattener([x], path.dirname(tpath)).then(res => newWindowBeside(res)).then( () => {
                        vscode.window.showInformationMessage('[Flatten success] ' + x)
                    }).catch(ex => {
                        vscode.window.showErrorMessage('[Flatten failed] ' + x + "\n" + ex.message + "\n\n" + "NOTE: Please make sure to run `npm install` in the truffle project dir.")
                        console.error(ex)
                    })
                })
            })

        })
    )
}

/* exports */
exports.activate = onActivate;