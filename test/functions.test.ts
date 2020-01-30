import { expect } from 'chai'
import 'mocha'
import Log, { readConfigFile, resolveColors } from '../src/log'

describe('functions', function() {
  describe('resolveColors', function() {
    it('should replace all color strings with the correct code', function() {
      let str = 'color(red)Error!!!!color(reset)color(blue)not'
      let resolved = resolveColors(str)
      expect(resolved).to.equal('\x1b[31mError!!!!\x1b[0m\x1b[34mnot')
    })
  })

  describe('readConfigFile', function() {
    it('should read and set the levels of the config file', function() {
      readConfigFile()
      expect(Log.globalLevel).to.equal('silent')
      expect(Log.levels["globalLevel"]).to.be.undefined
      expect(Log.levels["a"]).to.equal("warn")
      expect(Log.levels["b"]).to.equal("debug")
    })
  })
})