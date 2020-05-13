/** 
 * @author github.com/tintinweb
 * @license MIT
 * 
  * */


/** imports */
const vscode = require("vscode");
const path = require('path');

const truffleFlattener = require("truffle-flattener");
const findUp = require("find-up");

/** global vars */
const LANGID = 'solidity';
const EXTENSION_PREFIX = 'vscode-solidity-flattener';

//const config = vscode.workspace.getConfiguration(EXTENSION_PREFIX);

/** classdecs */


/** funcdecs */

function newWindowBeside(content) {
    vscode.workspace.openTextDocument({ content: content, language: LANGID })
        .then(doc => vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside));
}

function isSubpath(parent, dir) {
    const relative = path.relative(parent, dir);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}


/** event funcs */
function onActivate(context) {

    context.subscriptions.push(
        vscode.commands.registerCommand(EXTENSION_PREFIX + '.activeFile.flatten', (args) => {

            let activeDoc = vscode.window.activeTextEditor.document;
            let activeFile= activeDoc.fileName;

            let workspacePath = vscode.workspace.getWorkspaceFolder(activeDoc.uri);

            if (activeFile.endsWith(".sol")) {
                findUp(["truffle.js", "truffle-config.js"], { "cwd": path.dirname(activeFile) }).then(tpath => {
                    if (!workspacePath || !isSubpath(workspacePath.uri.fsPath, tpath)) {
                        vscode.window.showErrorMessage(`[Flatten failed] ${activeFile}\nThe contract does not appear to be part of a truffle project.`);
                        return;
                    }

                    truffleFlattener([activeFile], path.dirname(tpath)).then(res => newWindowBeside(res)).then(() => {
                        vscode.window.showInformationMessage(`[Flatten success]  ${activeFile}`);
                    }).catch(ex => {
                        vscode.window.showErrorMessage(`[Flatten failed] ${activeFile}\n${ex.message}\n\nNOTE: Please make sure to run \`npm install\` in the truffle project dir.`);
                        console.error(ex);
                    });
                });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(EXTENSION_PREFIX + '.contextMenu.flatten', async (clickedFile, selectedFiles) => {

            selectedFiles.filter(x => x.fsPath.endsWith(".sol")).forEach(x => {
                findUp(["truffle.js", "truffle-config.js"], { "cwd": path.dirname(x.fsPath) }).then(tpath => {

                    let workspacePath = vscode.workspace.getWorkspaceFolder(x);

                    if (!workspacePath || !isSubpath(workspacePath.uri.fsPath, tpath)) {
                        vscode.window.showErrorMessage(`[Flatten failed] ${x.fsPath}\nThe contract does not appear to be part of a truffle project.`);
                        return;
                    }

                    truffleFlattener([x.fsPath], path.dirname(tpath)).then(res => newWindowBeside(res)).then(() => {
                        vscode.window.showInformationMessage(`[Flatten success] ${x.fsPath}`);
                    }).catch(ex => {
                        vscode.window.showErrorMessage(`[Flatten failed] ${x.fsPath}\n${ex.message}\n\nNOTE: Please make sure to run \`npm install\` in the truffle project dir.`);
                        console.error(ex);
                    });
                });
            });

        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(EXTENSION_PREFIX + '.flatten', async (args) => {
            // take document or string; default active editor if
            args = args || {};
            let options = {
                files: args.files,
                showErrors: args.showErrors === undefined ? true : showErrors,
                callback: args.callback || function (file, tpath, res) { newWindowBeside(res); }
            };

            options.files.filter(x => x.fsPath.endsWith(".sol")).forEach(x => {
                findUp(["truffle.js", "truffle-config.js"], { "cwd": path.dirname(x.fsPath) }).then(tpath => {

                    let workspacePath = vscode.workspace.getWorkspaceFolder(x);

                    if (!workspacePath || !isSubpath(workspacePath.uri.fsPath, tpath)) {
                        options.showErrors && vscode.window.showErrorMessage(`[Flatten failed] ${x.fsPath}\nThe contract does not appear to be part of a truffle project.`);
                        return;
                    }

                    truffleFlattener([x.fsPath], path.dirname(tpath)).then(res => options.callback(x.fsPath, tpath, res)).then(() => {
                        options.showErrors && vscode.window.showInformationMessage(`[Flatten success] ${x.fsPath}`);
                    }).catch(ex => {
                        options.showErrors && vscode.window.showErrorMessage(`[Flatten failed] ${x.fsPath} \n${ex.message}\n\nNOTE: Please make sure to run \`npm install\` in the truffle project dir.`);
                        console.error(ex);
                    });
                });
            });

        })
    );
}

/* exports */
exports.activate = onActivate;