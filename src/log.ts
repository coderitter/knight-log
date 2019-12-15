export default class Log {

  static readonly logs: Log[] = []
  static levels: { [key: string]: string } = {}
  static globalLevel: string = 'info'

  filePath: string
  private _clsName?: string
  fnName?: string
  private _level?: string

  constructor(__filename: string, level?: string) {
    this.filePath = __filename
    this._level = level

    Log.logs.push(this)
  }

  get filename(): string {
    return getFilename(this.filePath)
  }

  get clsName(): string {
    if (this._clsName == undefined) {
      return getFilenameWithoutExtension(this.filePath)
    }
    
    return this._clsName
  }
  
  set clsName(clsName: string) {
    this._clsName = clsName
  }

  get level(): string {
    if (this._level != undefined) {
      return this._level
    }

    if (this.filename in Log.levels) {
      return Log.levels[this.filename]
    }

    if (this.clsName in Log.levels) {
      return Log.levels[this.clsName]
    }

    if (this.clsName + '.' + this.fnName in Log.levels) {
      return Log.levels[this.clsName + '.' + this.fnName]
    }

    return Log.globalLevel
  }

  set level(level: string) {
    this._level = level
  }

  get levelNumber(): number {
    return levelToNumber(this.level)
  }

  cls(clsName: string, fnName?: string): Log {
    if (fnName != undefined) {
      this.debug(`Entering '${this.clsName}.${fnName}'`)
    }
    
    let clone = this.clone()
    clone.clsName = clsName

    if (fnName != undefined) {
      clone.fnName = fnName      
    }

    return clone
  }

  fn(fnName: string): Log {
    this.debug(`Entering '${this.clsName}.${fnName}'`)
    let clone = this.clone()
    clone.fnName = fnName
    return clone
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('error')) {
      console.error(this.createLogString(message), ...optionalParams)
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('warn')) {
      console.warn(this.createLogString(message), ...optionalParams)
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('info')) {
      console.info(this.createLogString(message), ...optionalParams)
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('debug')) {
      console.debug(this.createLogString(message), ...optionalParams)
    }
  }

  insane(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('insane')) {
      console.debug(this.createLogString(message), ...optionalParams)
    }
  }

  clone(): Log {
    let clone = new Log(this.filePath)
    clone.fnName = this.fnName
    clone.level = this.level
    return clone
  }

  private createLogString(message?: string) {
    if (this._clsName != undefined) {
      return '\x1b[36m' + this.filename + ' > ' + this.clsName + (this.fnName ? '.' + this.fnName : '') + '$\x1b[0m ' + (message ? message : '')
    }
    else {
      return '\x1b[36m' + this.clsName + (this.fnName ? '.' + this.fnName : '') + '$\x1b[0m ' + (message ? message : '')
    }
  }
}

function levelToNumber(level: string|undefined) {
  switch(level) {
    default: return 0
    case 'error': return 1
    case 'warn': return 2
    case 'info': return 3
    case 'debug': return 4
    case 'insane': return 5
  }
}

function getFilename(filePath: string): string {
  let sep = '/'
  
  if (filePath.indexOf('\\') > -1) {
    sep = '\\'
  }

  let split = filePath.split(sep)

  return split[split.length - 1]
}

function getFilenameWithoutExtension(filePath: string): string {
  let filename = getFilename(filePath)

  let split = filename.split('.')
  return split.length > 0 ? split[0] : 'filenameWithoutExtension'
}

const reset = "\x1b[0m"
const bright = "\x1b[1m"
const dim = "\x1b[2m"
const underscore = "\x1b[4m"
const blink = "\x1b[5m"
const reverse = "\x1b[7m"
const hidden = "\x1b[8m"

const fontBlack = "\x1b[30m"
const fontRed = "\x1b[31m"
const fontGreen = "\x1b[32m"
const fontYellow = "\x1b[33m"
const fontBlue = "\x1b[34m"
const fontMagenta = "\x1b[35m"
const fontCyan = "\x1b[36m"
const fontWhite = "\x1b[37m"

const backgroundBlack = "\x1b[40m"
const backgroundRed = "\x1b[41m"
const backgroundGreen = "\x1b[42m"
const backgroundYellow = "\x1b[43m"
const backgroundBlue = "\x1b[44m"
const backgroundMagenta = "\x1b[45m"
const backgroundCyan = "\x1b[46m"
const backgroundWhite = "\x1b[47m"
