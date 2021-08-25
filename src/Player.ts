
const cp = require('child_process')
const path = require('path')
const player = require('play-sound')()

interface PlayerConfig
{
    macVol: number
    winVol: number
    linuxVol: number
}

const playerAdapter = (opts: PlayerConfig) => ({
    afplay: ['-v', opts.macVol],
    mplayer: ['-af', `volume=${opts.linuxVol}`],
})


export default class
{
    _isWindows = process.platform === 'win32'
    _playerWindowsPath = path.join(__dirname, '..', 'audio', 'sounder.exe')
    playerConfig =
        {
            macVol: 1,
            winVol: 100,
            linuxVol: 100
        }

    play(filePath: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._isWindows) {
                cp.execFile(this._playerWindowsPath, ['/vol', this.playerConfig.winVol, filePath])
                resolve()
            } else {
                player.play(path.join(__dirname, '..', 'audio', filePath), this.playerAdapter(this.playerConfig), (err: any) =>
                {
                    if (err) {
                        console.error("Error playing sound:", filePath, " - Description:", err)
                        return reject(err)
                    }
                    resolve()
                })
            }
        })
    }

    playerAdapter(opts: PlayerConfig)
    {
        return {
            afplay: ['-v', this.playerConfig.macVol],
            mplayer: ['-af', `volume=${this.playerConfig.linuxVol}`],
        }
    }
}