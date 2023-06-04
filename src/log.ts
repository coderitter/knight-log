export class Log {

  static levels: { [key: string]: string } = {}
  static globalLevel: string = 'admin'
  static watcher: any

  filename: string
  private _clsName?: string
  fnName?: string
  mtName?: string
  private _level?: string
  location?: string[]
  locationSeparator = ' '

  constructor(filename: string, level?: string) {
    this.filename = filename
    this._level = level
  }

  get filenameWithoutExtension(): string {
    let split = this.filename.split('.')
    return split.length > 0 ? split[0] : 'filenameWithoutExtension'  
  }

  get clsName(): string {
    if (this._clsName == undefined) {
      return this.filenameWithoutExtension
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

    // Filename.ts > Class.method
    let filePlusClassPlusMethod = `${this.filename} > ${this.clsName}.${this.mtName}`
    if (filePlusClassPlusMethod in Log.levels) {
      return Log.levels[filePlusClassPlusMethod]
    }

    // Filename.ts > Class
    let filePlusClass = `${this.filename} > ${this.clsName}`
    if (filePlusClass in Log.levels) {
      return Log.levels[filePlusClass]
    }

    // Filename.ts > Function
    let filePlusFunction = `${this.filename} > ${this.fnName}`
    if (filePlusFunction in Log.levels) {
      return Log.levels[filePlusFunction]
    }

    // Filename.ts
    if (this.filename in Log.levels) {
      return Log.levels[this.filename]
    }

    // Class.method
    let classPlusMethod = `${this.clsName}.${this.mtName}`
    if (classPlusMethod in Log.levels) {
      return Log.levels[classPlusMethod]
    }

    // Class
    let classOnly = `${this.clsName}`
    if (classOnly in Log.levels) {
      return Log.levels[classOnly]
    }

    // Function
    let functionOnly = `${this.fnName}`
    if (functionOnly in Log.levels) {
      return Log.levels[functionOnly]
    }

    if (Log.levels != undefined && Log.levels.globalLevel != undefined && Log.levels.globalLevel.length > 0) {
      return Log.levels.globalLevel
    }
    
    return Log.globalLevel
  }

  set level(level: string) {
    this._level = level
  }

  get levelNumber(): number {
    return levelToNumber(this.level)
  }

  cls(clsName: string, mtName?: string): Log {    
    let clone = this.clone()

    if (mtName != undefined) {
      clone.mtName = mtName
    }

    if (mtName != undefined) {
      clone.dev(`${logColor(LogColor.bright)}Entering '${mtName}'`)
    }

    clone.clsName = clsName


    return clone
  }

  fn(fnName: string, level?: string): Log {
    let clone = this.clone()

    if (level != undefined) {
      clone.level = level
    }

    clone.dev(`${logColor(LogColor.bright)}Entering '${fnName}'`)
    clone.fnName = fnName

    return clone
  }

  mt(mtName: string, level?: string): Log {
    let clone = this.clone()

    if (level != undefined) {
      clone.level = level
    }

    clone.dev(`${logColor(LogColor.bright)}Entering '${mtName}'`)
    clone.mtName = mtName

    return clone
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('error')) {
      console.log(this.createMessage(LogColor.red, message, optionalParams?.length), ...optionalParams)
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('warn')) {
      console.log(this.createMessage(LogColor.yellow, message, optionalParams?.length), ...optionalParams)
    }
  }

  admin(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('admin')) {
      console.log(this.createMessage(LogColor.white, message, optionalParams?.length), ...optionalParams)
    }
  }

  adminColor(color: LogColor, message?: any, ...optionalParams: any[]): void {
    this.admin(logColor(color) + message, ...optionalParams)
  }

  dev(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('dev')) {
      console.log(this.createMessage(LogColor.cyan, message, optionalParams?.length), ...optionalParams)
    }
  }

  devColor(color: LogColor, message?: any, ...optionalParams: any[]): void {
    this.dev(logColor(color) + message, ...optionalParams)
  }

  creator(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('ceator')) {
      console.log(this.createMessage(LogColor.cyan, message, optionalParams?.length), ...optionalParams)
    }
  }

  creatorColor(color: LogColor, message?: any, ...optionalParams: any[]): void {
    this.creator(logColor(color) + message, ...optionalParams)
  }

  param(name: string, value: any): void {
    this.dev(logColor(LogColor.dim) + 'parameter: ' + name, value)
  }

  calling(message: string, ...optionalParams: any[]): void {
    this.dev(logColor(LogColor.bright) + message, ...optionalParams)
  }

  called(message: string, ...optionalParams: any[]): void {
    this.dev(logColor(LogColor.bright) + message, ...optionalParams)
  }

  returning(message: string, ...optionalParams: any[]): void {
    this.dev(logColor(LogColor.bright) + message, ...optionalParams)
  }

  createLocation(color: LogColor): string {
    let prefix = logColor(color)

    if (this.mtName) {
      if (this._clsName) {
        prefix += this.filename + ' > ' + this._clsName + '.' + this.mtName
      }
      else {
        prefix += this.clsName + '.' + this.mtName
      }
    }
    else if (this.fnName) {
      prefix += this.filename + ' > ' + this.fnName
    }
    else {
      prefix += this.filename
    }

    return prefix +
      logColor(LogColor.reset) +
      (this.location != undefined && this.location.length > 0 ? ' ( ' + this.location.join(this.locationSeparator) + ' ) ' : ' ')
  }

  createMessage(locationColor: LogColor, message?: string, optionalParamCount?: number) {
    if (! message) {
      message = ''
    }
    else if (optionalParamCount) {
      message = logColor(LogColor.dim) + message
    }

    return this.createLocation(locationColor) + message + logColor(LogColor.reset)
  }

  clone(): Log {
    let clone = new Log(this.filename)

    clone._clsName = this._clsName
    clone.fnName = this.fnName
    clone.mtName = this.mtName
    clone._level = this._level
    clone.location = this.location?.slice()
    clone.locationSeparator = this.locationSeparator

    return clone
  }

  static stopWatcher() {
    if (this.watcher) {
      this.watcher.stop()
      console.log('Stopped watcher for loglevels.json')
    }
  }
}

function levelToNumber(level: string|undefined) {
  switch(level) {
    default: return 0
    case 'error': return 1
    case 'warn': return 2
    case 'admin': return 3
    case 'dev': return 4
    case 'creator': return 5
  }
}

export enum LogColor {
  reset = 'reset',
  bright = 'bright',
  dim = 'dim',
  underscore = 'underscore',
  blink = 'blink',
  reverse = 'reverse',
  hidden = 'hidden',
  black = 'black',
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  magenta = 'magenta',
  cyan = 'cyan',
  white = 'white',
  bgBlack = 'bgBlack',
  bgRed = 'bgRed',
  bgGreen = 'bgGreen',
  bgYellow = 'bgYellow',
  bgBlue = 'bgBlue',
  bgMagenta = 'bgMagenta',
  bgCyan = 'bgCyan',
  bgWhite = 'bgWhite'
}

export function logColor(color: LogColor): string {
  if (typeof window === 'undefined') {
    // running in Node
    switch (color) {
      case LogColor.reset: return '\x1b[0m'
      case LogColor.bright: return '\x1b[1m'
      case LogColor.dim: return '\x1b[2m'
      case LogColor.underscore: return '\x1b[4m'
      case LogColor.blink: return '\x1b[5m'
      case LogColor.reverse: return '\x1b[7m'
      case LogColor.hidden: return '\x1b[8m'
      
      case LogColor.black: return '\x1b[30m'
      case LogColor.red: return '\x1b[31m'
      case LogColor.green: return '\x1b[32m'
      case LogColor.yellow: return '\x1b[33m'
      case LogColor.blue: return '\x1b[34m'
      case LogColor.magenta: return '\x1b[35m'
      case LogColor.cyan: return '\x1b[36m'
      case LogColor.white: return '\x1b[37m'
      
      case LogColor.bgBlack: return '\x1b[40m'
      case LogColor.bgRed: return '\x1b[41m'
      case LogColor.bgGreen: return '\x1b[42m'
      case LogColor.bgYellow: return '\x1b[43m'
      case LogColor.bgBlue: return '\x1b[44m'
      case LogColor.bgMagenta: return '\x1b[45m'
      case LogColor.bgCyan: return '\x1b[46m'
      case LogColor.bgWhite: return '\x1b[47m'
      
      default: return ''
    }
  }
  else {
    // if running in browser colors are not supported
    return ''
  }
}

export function configFileName(): string {
  if (typeof window === 'undefined') {
    // requiring path with the help of a string variable will confuse webpack to not throw an error
    let path = require('path')
    return process.cwd() + path.sep + 'loglevels.json'
  }

  return ''
}

export function readConfigFile() {
  if (typeof window === 'undefined') {
    // requiring fs with the help of a string variable will confuse webpack to not throw this error
    // Module not found: Error: Can't resolve 'fs' in
    // it will result in a critical warning though: Critical dependency: the request of a dependency is an expression
    let fs = require('fs')
    let configFile = configFileName()
    
    if (fs.existsSync(configFile)) {
      console.log('Found log level config file: ' + configFile)

      try {
        var configJson = fs.readFileSync(configFile, 'utf8')
      }
      catch (e) {
        console.log('Could not read content of log level config file: ' + (e as Error).message)
        return 
      }

      try {
        var config = JSON.parse(configJson)
      }
      catch (e) {
        console.log('Could not parse JSON from log level config file: ' + (e as Error).message)
        return
      }

      let reworkedConfig: any = {}

      for (let key in config) {
        let value = config[key]

        if (value) {
          reworkedConfig[key] = value
        }
      }

      console.log('Setting levels: ', reworkedConfig)
      Log.levels = reworkedConfig
    }
    else {
      console.log('Could not find log level config file: ' + configFile)
    }
  }
}

readConfigFile()

if (typeof window === 'undefined') {
  // requiring fs with the help of a  string variable will confuse webpack to not throw this error
  // Module not found: Error: Can't resolve 'fs' in
  // it will result in a critical warning though: Critical dependency: the request of a dependency is an expression
  let fs = require('fs')

  if (fs.existsSync(configFileName())) {
    // TODO: close watcher maybe: watcher.close()
    Log.watcher = fs.watch(configFileName(), () => {
      console.log('loglevels.json changed. Re-reading content...')
      readConfigFile()
    })

    console.log('Installed file watcher for loglevels.json for package ' + __dirname)
  }
}