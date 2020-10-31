export default class Log {

  static levels: { [key: string]: string } = {}
  static globalLevel: string = 'admin'
  static watcher: any

  filename: string
  private _clsName?: string
  fnName?: string
  mtName?: string
  private _level?: string
  location?: string[]

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
    if (mtName != undefined) {
      this.user(`${resolveColor('bright')}Entering '${this.clsName}.${mtName}'`)
    }
    
    let clone = this.clone()
    clone.clsName = clsName

    if (mtName != undefined) {
      clone.mtName = mtName      
    }

    return clone
  }

  fn(fnName: string, level?: string): Log {
    this.user(`${resolveColor('bright')}Entering '${this.filename} > ${fnName}'`)
    let clone = this.clone()
    clone.fnName = fnName

    if (level != undefined) {
      clone.level = level
    }

    return clone
  }

  mt(mtName: string, level?: string): Log {
    this.user(`${resolveColor('bright')}Entering '${this.clsName}.${mtName}'`)
    let clone = this.clone()
    clone.mtName = mtName

    if (level != undefined) {
      clone.level = level
    }

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

  admin(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('admin')) {
      console.log(this.createMessageString('white', message), ...optionalParams)
    }
  }

  user(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('user')) {
      console.log(this.createMessageString('cyan', message), ...optionalParams)
    }
  }

  dev(message?: any, ...optionalParams: any[]): void {
    if (this.levelNumber >= levelToNumber('dev')) {
      console.log(this.createMessageString('cyan', message), ...optionalParams)
    }
  }

  param(name: string, value: any): void {
    this.user(resolveColor('dim') + 'parameter: ' + name, value)
  }

  returning(message: string, ...optionalParams: any[]): void {
    this.user(resolveColor('bright') + message, ...optionalParams)
  }

  var(name: string, value: any): void {
    this.dev(resolveColor('dim') + name, value)
  }

  createMessageString(color: string, message?: string) {
    let messageString = resolveColor(color)

    if (this.mtName) {
      if (this._clsName) {
        messageString += this.filename + ' > ' + this._clsName + '.' + this.mtName
      }
      else {
        messageString += this.clsName + '.' + this.mtName
      }
    }
    else if (this.fnName) {
      messageString += this.filename + ' > ' + this.fnName
    }
    else {
      messageString += this.filename
    }

    return messageString +
      resolveColor('reset') +
      (this.location != undefined ? ' ( ' + this.location.join('') + ' ) ' : ' ') +
      (message ? message : '') +
      resolveColor('reset')
  }

  clone(): Log {
    let clone = new Log(this.filename)
    clone._clsName = this._clsName
    clone.fnName = this.fnName
    clone.mtName = this.mtName
    clone._level = this._level
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
    case 'user': return 4
    case 'dev': return 5
  }
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
    // it will result in a critical warning though: Critical dependency: the request of a dependency is an expression
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
  let fsName = 'fs'
  let fs = require(fsName)

  if (fs.existsSync(configFileName())) {
    // TODO: close watcher maybe: watcher.close()
    Log.watcher = fs.watch(configFileName(), () => {
      console.log('loglevels.json changed. Re-reading content...')
      readConfigFile()
    })

    console.log('Installed file watcher for loglevels.json for package ' + __dirname)
  }
}