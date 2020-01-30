import { expect } from 'chai'
import 'mocha'
import Log, { resolveColors } from '../src/log'

describe('Log', function() {
  describe('level', function() {
    it('should consider objectname.method notiation', function() {
      
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

  describe('resolveColors', function() {
    it('should replace all color strings with the correct code', function() {
      let str = 'color(red)Error!!!!color(reset)color(blue)not'
      let resolved = resolveColors(str)
      expect(resolved).to.equal('\x1b[31mError!!!!\x1b[0m\x1b[34mnot')
    })
  })
})