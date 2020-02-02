export default class Log {

  static readonly logs: Log[] = []
  static levels: { [key: string]: string } = {}
  static globalLevel: string = 'info'

  filePath: string
  private _clsName?: string
  fnName?: string
  mtName?: string
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

    // Filename.ts > function
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

    // function
    let functionOnly = `${this.fnName}`
    if (functionOnly in Log.levels) {
      return Log.levels[functionOnly]
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
    this.debug(`Entering '${this.filename} > ${fnName}'`)
    let clone = this.clone()
    clone.fnName = fnName
    return clone
  }

  mt(mtName: string): Log {
    this.debug(`Entering '${this.clsName}.${mtName}'`)
    let clone = this.clone()
    clone.mtName = mtName
    return clone
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('error')) {
      console.log(this.createMessageString('red', message), ...optionalParams)
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('warn')) {
      console.log(this.createMessageString('yellow', message), ...optionalParams)
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('info')) {
      console.log(this.createMessageString('white', message), ...optionalParams)
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('debug')) {
      console.log(this.createMessageString('cyan', message), ...optionalParams)
    }
  }

  insane(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('insane')) {
      console.log(this.createMessageString('cyan', message), ...optionalParams)
    }
  }

  var(name: string, value: any): void {
    if (typeof window === 'undefined') {
      this.debug(name + ' =', value)
    }
    else {
      this.debug(name, value)
    }
  }

  createMessageString(color: string, message?: string) {
    if (this.mtName) {
      if (this._clsName) {
        return resolveColor(color) + 
          this.filename + ' > ' + this._clsName + '.' + this.mtName + ' ' +
          resolveColor('reset') +
          (message ? message : '') +
          resolveColor('reset')
      }
      else {
        return resolveColor(color) + 
          this.clsName + '.' + this.mtName + ' ' +
          resolveColor('reset') +
          (message ? message : '') +
          resolveColor('reset')
      }
    }
    else if (this.fnName) {
      return resolveColor(color) + 
        this.filename + ' > ' + this.fnName + ' ' +
        resolveColor('reset') +
        (message ? message : '') +
        resolveColor('reset')
    }
    else {
      return resolveColor(color) + 
        this.filename + ' ' +
        resolveColor('reset') +
        (message ? message : '') +
        resolveColor('reset')
    }
  }

  clone(): Log {
    let clone = new Log(this.filePath)
    clone._clsName = this._clsName
    clone.fnName = this.fnName
    clone.mtName = this.mtName
    clone.level = this.level
    return clone
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

export function configFileName(): string {
  if (typeof window === 'undefined') {
    let path = require('path')
    return process.cwd() + path.sep + 'loglevels.json'
  }

  return ''
}

export function readConfigFile() {
  if (typeof window === 'undefined') {
    // requiring fs with the help of a  string variable will confuse webpack to not throw this error
    // Module not found: Error: Can't resolve 'fs' in
    let fsName = 'fs'
    let fs = require(fsName)
    let configFile = configFileName()
    
    if (fs.existsSync(configFile)) {
      console.log('Found log level config file: ' + configFile)

      try {
        var configJson = fs.readFileSync(configFile, 'utf8')
      }
      catch (e) {
        console.log('Could not read content of log level config file: ' + e.message)
        return 
      }

      try {
        var config = JSON.parse(configJson)
      }
      catch (e) {
        console.log('Could not parse JSON from log level config file: ' + e.message)
        return
      }

      if (config.globalLevel) {
        console.log('Setting global level: ' + config.globalLevel)
        Log.globalLevel = config.globalLevel
        delete config.globalLevel
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
  let fsName = 'fs'
  let fs = require(fsName)

  if (fs.existsSync(configFileName())) {
    // TODO: close watcher maybe: watcher.close()
    let watcher = fs.watch(configFileName(), () => {
      console.log('loglevels.json changed. Re-reading content...')
      readConfigFile()
    })

    console.log('Installed file watcher for loglevels.json')
  }
}