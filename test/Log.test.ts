import 'mocha'
import { expect } from 'chai'
import Log, { resolveColors } from '../src/log'

describe('Log', function() {
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
      Log.levels['Class'] = 'info'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'

      expect(log.level).to.equal('info')
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
      Log.levels['Class.method'] = 'info'

      let log = new Log('Filename.ts')
      log.mtName = 'method'
      log.clsName = 'Class'

      expect(log.level).to.equal('info')
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
      Log.levels['Filename.ts'] = 'info'

      let log = new Log('Filename.ts')
      log.fnName = 'function'

      expect(log.level).to.equal('info')
    })

    it('should use the corresponding level for the filename instead of class name and method', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'
      Log.levels['Class'] = 'info'
      Log.levels['Class.method'] = 'debug'
      Log.levels['Filename.ts'] = 'insane'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'
      log.mtName = 'method'

      expect(log.level).to.equal('insane')
    })

    it('should use the corresponding level for filename and function', function() {
      Log.globalLevel = 'error'
      Log.levels['function'] = 'warn'
      Log.levels['Filename.ts'] = 'info'
      Log.levels['Filename.ts > function'] = 'debug'

      let log = new Log('Filename.ts')
      log.fnName = 'function'

      expect(log.level).to.equal('debug')
    })

    it('should use the corresponding level for the filename and class', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'
      Log.levels['Class'] = 'info'
      Log.levels['Filename.ts'] = 'debug'
      Log.levels['Filename.ts > Class'] = 'insane'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'

      expect(log.level).to.equal('insane')
    })

    it('should use the corresponding level for the filename, class and method', function() {
      Log.globalLevel = 'error'
      Log.levels['Filename'] = 'warn'
      Log.levels['Class'] = 'warn'
      Log.levels['Filename.method'] = 'warn'
      Log.levels['Class.method'] = 'warn'
      Log.levels['Filename.ts'] = 'info'
      Log.levels['Filename.ts > Class'] = 'debug'
      Log.levels['Filename.ts > Class.method'] = 'insane'

      let log = new Log('Filename.ts')
      log.clsName = 'Class'
      log.mtName = 'method'

      expect(log.level).to.equal('insane')
    })
  })

  describe('createMessage', function() {
    it('should use the filename if nothing else is set', function() {
      let log = new Log('Filename.ts')
      let str = log.createMessageString('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts \x1b[0mmessage\x1b[0m')
    })

    it('should use the function name if set', function() {
      let log = new Log('Filename.ts')
      log.fnName = 'function'
      let str = log.createMessageString('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts > function \x1b[0mmessage\x1b[0m')
    })

    it('should use the method name if set and use the filename without extension as class name', function() {
      let log = new Log('Filename.ts')
      log.mtName = 'method'
      let str = log.createMessageString('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.method \x1b[0mmessage\x1b[0m')
    })

    it('should use the method name if set and use the filename without extension as class name', function() {
      let log = new Log('Filename.ts')
      log.clsName = 'Class'
      log.mtName = 'method'
      let str = log.createMessageString('cyan', 'message')
      expect(str).to.equal('\x1b[36mFilename.ts > Class.method \x1b[0mmessage\x1b[0m')
    })
  })
})