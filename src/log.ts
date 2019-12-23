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
      console.error(this.createMessageString(message), ...optionalParams)
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('warn')) {
      console.warn(this.createMessageString(message), ...optionalParams)
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('info')) {
      console.info(this.createMessageString(message), ...optionalParams)
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('debug')) {
      console.debug(this.createMessageString(message), ...optionalParams)
    }
  }

  insane(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('insane')) {
      console.debug(this.createMessageString(message), ...optionalParams)
    }
  }

  clone(): Log {
    let clone = new Log(this.filePath)
    clone.fnName = this.fnName
    clone.level = this.level
    return clone
  }

  private createMessageString(message?: string) {
    if (this._clsName != undefined) {
      return resolveColors(
        'color(cyan)' + 
        this.filename + ' > ' + 
        this.clsName + (this.fnName ? '.' + this.fnName : '') + 
        '$color(reset) ' + 
        (message ? message : '')) + 
        'color(reset)'
    }
    else {
      return resolveColors(
        'color(cyan)' + 
        this.clsName + (this.fnName ? '.' + this.fnName : '') + 
        '$color(reset) ' + 
        (message ? message : '')) + 
        'color(reset)'
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

export function resolveColors(str: string): string {
  let regex = /color\((\w+)\)/
  let match = regex.exec(str)

  while (match) {
    let color = match[0]
    let colorName = match[1]
    let colorCode = resolveColor(colorName)
    str = str.replace(color, colorCode)
    match = regex.exec(str)
  }

  return str
}

function resolveColor(colorName: string): string {
  if (typeof window === 'undefined') {
    // running in Node
    switch (colorName) {
      case 'reset': return '\x1b[0m'
      case 'bright': return '\x1b[1m'
      case 'dim': return '\x1b[2m'
      case 'underscore': return '\x1b[4m'
      case 'blink': return '\x1b[5m'
      case 'reverse': return '\x1b[7m'
      case 'hidden': return '\x1b[8m'
      
      case 'black': return '\x1b[30m'
      case 'red': return '\x1b[31m'
      case 'green': return '\x1b[32m'
      case 'yellow': return '\x1b[33m'
      case 'blue': return '\x1b[34m'
      case 'magenta': return '\x1b[35m'
      case 'cyan': return '\x1b[36m'
      case 'white': return '\x1b[37m'
      
      case 'bgBlack': return '\x1b[40m'
      case 'bgRed': return '\x1b[41m'
      case 'bgGreen': return '\x1b[42m'
      case 'bgYellow': return '\x1b[43m'
      case 'bgBlue': return '\x1b[44m'
      case 'bgMagenta': return '\x1b[45m'
      case 'bgCyan': return '\x1b[46m'
      case 'bgWhite': return '\x1b[47m'
      default: return ''
    }
  }
  else {
    // if running in browser colors are not supported
    return ''
  }
}