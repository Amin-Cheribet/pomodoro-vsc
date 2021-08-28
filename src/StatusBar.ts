import * as vscode from 'vscode'

export default class
{

    text: vscode.StatusBarItem
    startButton: vscode.StatusBarItem
    continueButton: vscode.StatusBarItem
    stopButton: vscode.StatusBarItem
    resetButton: vscode.StatusBarItem

    constructor()
    {
        this.text = this.createItem()

        this.startButton = this.createItem();
        this.startButton.text = `$(debug-start)`
        this.startButton.command = "pomodoro.start"
        this.startButton.tooltip = "Start"
        this.startButton.color = 'green'
        this.startButton.show()

        this.continueButton = this.createItem()
        this.continueButton.text = `$(debug-continue)`
        this.continueButton.command = "pomodoro.continue"
        this.continueButton.tooltip = "Continue"
        this.continueButton.color = 'green'

        this.stopButton = this.createItem()
        this.stopButton.text = "$(debug-pause)"
        this.stopButton.command = "pomodoro.stop"
        this.stopButton.tooltip = "Stop"
        this.stopButton.color = 'red'

        this.resetButton = this.createItem(-11)
        this.resetButton.text = "$(debug-restart)"
        this.resetButton.command = "pomodoro.reset"
        this.resetButton.tooltip = "Reset"
        this.resetButton.color = 'red'
    }

    start(): void
    {
        this.text.color = 'red'
        this.text.show()
        this.stopButton.show()
        this.startButton.hide()
        this.continueButton.hide()
        this.resetButton.show()
    }

    continue(): void
    {
        this.text.show()
        this.continueButton.hide()
        this.stopButton.show()
    }

    stop(): void
    {
        this.text.color = 'green'
        this.text.show()
        this.stopButton.hide()
        this.continueButton.show()
    }

    pause(): void
    {
        this.text.color = 'green'
        this.text.show()
        this.stopButton.show()
        this.continueButton.hide()
    }

    reset(): void
    {
        this.text.hide()
        this.stopButton.hide()
        this.continueButton.hide()
        this.resetButton.hide()
        this.startButton.show()
    }

    updateText(time: string): void
    {
        this.text.text = time
    }

    createItem(priority: number = -10)
    {
        return vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left, priority
        )
    }
}