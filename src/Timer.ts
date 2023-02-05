import * as vscode from 'vscode'

import Player from './Player'
import StatusBar from './StatusBar'

export default class {
  remainingSeconds: number
  remainingMinutes: number
  active: NodeJS.Timeout | undefined = undefined
  stopFlag: boolean = false
  notificationSoundFlag: boolean = true
  status: "work" | "pause" = "work"
  config: vscode.WorkspaceConfiguration
  statusBar: StatusBar
  player: Player

  constructor(statusBar: StatusBar, player: Player) {
    this.player = player
    this.config = vscode.workspace.getConfiguration("pomodoro")
    this.remainingMinutes = this.config.workTime
    this.remainingSeconds = 0
    this.statusBar = statusBar
  }

  getTimeText() {
    return `${this.remainingMinutes < 10 ? "0" + this.remainingMinutes : this.remainingMinutes}:${
      this.remainingSeconds < 10 ? "0" + this.remainingSeconds : this.remainingSeconds
    }`
  }

  tick() {
    if (!this.stopFlag) {
      this.remainingSeconds--
      if (this.remainingSeconds < 0) {
        this.remainingMinutes--
        this.remainingSeconds = 59
      }
    }

    if (this.remainingMinutes < 0 && !this.stopFlag) {
      this.stopFlag = true
      if (this.status === "work") {
        this.pause()
        this.statusBar.text.color = this.config.breakColorTime
      } else if (this.status === "pause") {
        this.work()
        this.statusBar.text.color = this.config.workColorTime
      }
    }
    this.statusBar.updateText(this.getTimeText())
  }

  start(terminal = false) {
    if (!this.active) {
      this.remainingMinutes = this.config.workTime
      this.remainingSeconds = 0
      this.active = setInterval(() => {
        this.tick()
      }, 1000)
    }
    this.work(terminal)
  }

  continue(terminal = false) {
    if (!this.active) {
      return
    }
    if (this.status === "pause") {
      this.statusBar.text.color = this.config.breakColorTime
    } else {
      this.statusBar.text.color = this.config.workColorTime
    }
    this.statusBar.continue()
    this.stopFlag = false
    this.notificationSoundFlag = false
  }

  work(terminal = false) {
    this.stopFlag = true
    this.notificationSoundFlag = true
    this.remainingMinutes = this.config.workTime
    this.remainingSeconds = 0
    this.statusBar.start()
    this.status = "work"
    if (!terminal) {
      vscode.window.showErrorMessage("Pomodoro: Do you want to start working ?", ...["Yes", "No"]).then((answer) => {
        if (answer === "Yes") {
          this.stopFlag = false
          this.notificationSoundFlag = false
        } else {
          this.notificationSoundFlag = false
          this.stop()
        }
      })
      this.player.play("sounds_bell.wav").catch((err) => vscode.window.showInformationMessage(err))
    } else {
      this.stopFlag = false
      this.notificationSoundFlag = false
    }

    let interval: NodeJS.Timeout = setInterval(() => {
      if (!this.notificationSoundFlag) {
        clearInterval(interval)
      } else {
        this.player.play("sounds_bell.wav").catch((err) => vscode.window.showInformationMessage(err))
      }
    }, this.config.soundIntervalNotification * 1000)
  }

  pause(terminal = false) {
    if (!this.active) {
      return
    }
    this.stopFlag = true
    this.notificationSoundFlag = true
    this.remainingMinutes = this.config.breakTime
    this.remainingSeconds = 0
    this.statusBar.pause()
    this.status = "pause"

    if (!terminal) {
      vscode.window.showErrorMessage("Pomodoro: Do you want to take a break ?", ...["Yes", "No"]).then((answer) => {
        if (answer === "Yes") {
          this.stopFlag = false
          this.notificationSoundFlag = false
        } else {
          this.stop()
          this.notificationSoundFlag = false
        }
      })

      this.player.play("sounds_chime.wav").catch((err) => vscode.window.showInformationMessage(err))
    } else {
      this.stopFlag = false
      this.notificationSoundFlag = false
    }
    let interval: NodeJS.Timeout = setInterval(() => {
      if (!this.notificationSoundFlag) {
        clearInterval(interval)
      } else {
        this.player.play("sounds_chime.wav").catch((err) => vscode.window.showInformationMessage(err))
      }
    }, this.config.soundIntervalNotification * 1000)
  }

  stop(terminal = false) {
    this.statusBar.stop()
    this.stopFlag = true
    this.notificationSoundFlag = false
  }

  reset(terminal = false) {
    this.statusBar.reset()
    if (this.active) {
      clearInterval(this.active)
      this.active = undefined
    }
    this.status = "work"
    this.remainingMinutes = this.config.workTime
    this.remainingSeconds = 0
    this.notificationSoundFlag = false
  }
}
