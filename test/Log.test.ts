import { expect } from 'chai'
import 'mocha'
import { Log } from '../src/log'

describe('Log', function() {
  beforeEach(function() {
    Log.globalLevel = 'admin'
    Log.levels = {}
  })

  describe('level', function() {
    it('should use the global level', function() {
      Log.globalLevel = 'error'

      let log = new Log('Filename.ts')

      expect(log.level).to.equal('error')
    })

    it('should use the corresponding level for the function', function() {
      Log.globalLevel = 'error'
      Log.levels['function'] = 'warn'

      let log = new Log('Filename.ts')
      log.fnName = 'function'

      expect(log.level).to.equal('warn')
    })

    it('should use the corresponding level for the filename as classname', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'

      let log = new Log('Filename.ts')

      expect(log.level).to.equal('warn')
    })

    it('should use the corresponding level for the explicitly set class name', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'
      Log.levels['Class'] = 'admin'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'

      expect(log.level).to.equal('admin')
    })

    it('should use the corresponding level for filename as class name and the set method', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename.method'] = 'warn'

      let log = new Log('Filename.ts')
      log.mtName = 'method'

      expect(log.level).to.equal('warn')
    })

    it('should use the corresponding level for the explicitly set class name and method', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename.method'] = 'warn'
      Log.levels['Class.method'] = 'admin'

      let log = new Log('Filename.ts')
      log.mtName = 'method'
      log.clsName = 'Class'

      expect(log.level).to.equal('admin')
    })

    it('should use the corresponding level for the filename', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename.ts'] = 'warn'

      let log = new Log('Filename.ts')

      expect(log.level).to.equal('warn')
    })

    it('should use the corresponding level for the filename instead of the function name', function() {
      Log.globalLevel = 'error'
      Log.levels['function'] = 'warn'
      Log.levels['Filename.ts'] = 'admin'

      let log = new Log('Filename.ts')
      log.fnName = 'function'

      expect(log.level).to.equal('admin')
    })

    it('should use the corresponding level for the filename instead of class name and method', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'
      Log.levels['Class'] = 'admin'
      Log.levels['Class.method'] = 'lib'
      Log.levels['Filename.ts'] = 'dev'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'
      log.mtName = 'method'

      expect(log.level).to.equal('dev')
    })

    it('should use the corresponding level for filename and function', function() {
      Log.globalLevel = 'error'
      Log.levels['function'] = 'warn'
      Log.levels['Filename.ts'] = 'admin'
      Log.levels['Filename.ts > function'] = 'lib'

      let log = new Log('Filename.ts')
      log.fnName = 'function'

      expect(log.level).to.equal('lib')
    })

    it('should use the corresponding level for the filename and class', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'
      Log.levels['Class'] = 'admin'
      Log.levels['Filename.ts'] = 'lib'
      Log.levels['Filename.ts > Class'] = 'dev'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'

      expect(log.level).to.equal('dev')
    })

    it('should use the corresponding level for the filename, class and method', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'
      Log.levels['Class'] = 'warn'
      Log.levels['Filename.method'] = 'warn'
      Log.levels['Class.method'] = 'warn'
      Log.levels['Filename.ts'] = 'admin'
      Log.levels['Filename.ts > Class'] = 'lib'
      Log.levels['Filename.ts > Class.method'] = 'dev'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'
      log.mtName = 'method'

      expect(log.level).to.equal('dev')
    })
  })

  describe('createMessage', function() {
    it('should use the filename if nothing else is set', function() {
      let log = new Log('Filename.ts')
      let str = log.createMessage('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m message\x1b[0m')
    })

    it('should use the function name if set', function() {
      let log = new Log('Filename.ts')
      log.fnName = 'function'
      let str = log.createMessage('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts > function\x1b[0m message\x1b[0m')
    })

    it('should use the method name if set and use the filename without extension as class name', function() {
      let log = new Log('Filename.ts')
      log.mtName = 'method'
      let str = log.createMessage('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.method\x1b[0m message\x1b[0m')
    })

    it('should use the method name if set and use the filename without extension as class name', function() {
      let log = new Log('Filename.ts')
      log.clsName = 'Class'
      log.mtName = 'method'
      let str = log.createMessage('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts > Class.method\x1b[0m message\x1b[0m')
    })

    it('should add the location', function() {
      let log = new Log('Filename.ts')
      log.location = [ 'Object1=a', '; Object2=b' ]
      let str = log.createMessage('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m ( Object1=a; Object2=b ) message\x1b[0m')
    })

    it('should not dim the message if there is no additional optional parameter', function() {
      let log = new Log('Filename.ts')
      let str = log.createMessage('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m message\x1b[0m')
    })

    it('should dim the message if there are additional optional parameters', function() {
      let log = new Log('Filename.ts')
      let str = log.createMessage('cyan', 'message', 1)
      expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m \x1b[2mmessage\x1b[0m')
    })
  })
})