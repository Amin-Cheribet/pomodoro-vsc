import * as vscode from 'vscode'

import Player from './Player'
import StatusBar from './StatusBar'
import Timer from './Timer'

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    console.log('Congratulations, your extension "pomodoro" is now active!')

    let timer: Timer = new Timer(new StatusBar(), new Player())
    let player = new Player()

    let start: vscode.Disposable = vscode.commands.registerCommand('pomodoro.start', () =>
    {
        timer.start()
    })

    let continueTimer: vscode.Disposable = vscode.commands.registerCommand('pomodoro.continue', () =>
    {
        timer.continue()
    })

    let pause: vscode.Disposable = vscode.commands.registerCommand('pomodoro.pause', () =>
    {
        timer.pause()
    })

    let reset: vscode.Disposable = vscode.commands.registerCommand('pomodoro.reset', () =>
    {
        timer.reset()
        vscode.window.showInformationMessage('Pomodoro reset')
    })

    let stop: vscode.Disposable = vscode.commands.registerCommand('pomodoro.stop', () =>
    {
        timer.stop()
    })

    let disposables: vscode.Disposable[] = []
    disposables.push(continueTimer, start, pause, reset, stop)

    for (let item of disposables) {
        context.subscriptions.push(item)
    }
}

export function deactivate()
{
    console.log("pomodoro deactivated")
}
