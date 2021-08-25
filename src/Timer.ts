import * as vscode from 'vscode'

import Player from './Player'
import StatusBar from './StatusBar'

export default class
{
    remainingSeconds: number
    remainingMinutes: number
    active: NodeJS.Timeout | undefined = undefined
    stopFlag: boolean = false
    status: 'work' | 'pause' = 'work'
    config: vscode.WorkspaceConfiguration
    statusBar: StatusBar
    player: Player

    constructor(statusBar: StatusBar, player: Player)
    {
        this.player = player
        this.config = vscode.workspace.getConfiguration("pomodoro")
        this.remainingMinutes = this.config.workTime
        this.remainingSeconds = 0
        this.statusBar = statusBar
    }

    getTimeText()
    {
        return `${this.remainingMinutes}:${this.remainingSeconds}`
    }

    tick()
    {
        if (!this.stopFlag) {
            this.remainingSeconds--
            if (this.remainingSeconds < 0) {
                this.remainingMinutes--
                this.remainingSeconds = 60
            }
        }

        if (this.remainingMinutes < 0) {
            if (this.status === 'work') {
                this.pause()
                this.statusBar.text.color = 'green'
            } else if (this.status === 'pause') {
                this.work()
                this.statusBar.text.color = 'red'
            }
        }
        this.statusBar.updateText(this.getTimeText())
    }

    start()
    {
        if (!this.active) {
            this.remainingMinutes = this.config.workTime
            this.remainingSeconds = 0
            this.active = setInterval(() =>
            {
                this.tick()
            }, 1000)
        }
        this.work()
    }

    continue()
    {
        if (this.status === 'pause') {
            this.statusBar.text.color = 'green'
        } else {
            this.statusBar.text.color = 'red'
        }
        this.statusBar.continue()
        this.stopFlag = false
    }

    work()
    {
        this.player.play('sounds_bell.wav').then().catch((err) =>
            vscode.window.showInformationMessage(err)
        )
        this.statusBar.start()
        this.status = 'work'
        this.remainingMinutes = this.config.workTime
        this.remainingSeconds = 0
        this.stopFlag = false
    }

    pause()
    {
        this.player.play('sounds_chime.wav').then().catch((err) =>
            vscode.window.showInformationMessage(err)
        )
        this.statusBar.pause()
        this.status = 'pause'
        this.remainingMinutes = this.config.breakTime
        this.remainingSeconds = 0
        this.stopFlag = false
    }

    stop()
    {
        this.statusBar.stop()
        this.stopFlag = true
    }

    reset()
    {
        this.statusBar.reset()
        if (this.active) {
            clearInterval(this.active)
            this.active = undefined
        }
        this.status = 'work'
        this.remainingMinutes = this.config.workTime
        this.remainingSeconds = 0
    }
}