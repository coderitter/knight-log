import { expect } from 'chai'
import * as fs from 'fs'
import 'mocha'
import Log, { configFileName, readConfigFile, resolveColors } from '../src/log'

describe('functions', function() {
  beforeEach(function() {
    Log.globalLevel = 'info'
    Log.levels = {}
  })

  describe('resolveColors', function() {
    it('should replace all color strings with the correct code', function() {
      let str = 'color(red)Error!!!!color(reset)color(blue)not'
      let resolved = resolveColors(str)
      expect(resolved).to.equal('\x1b[31mError!!!!\x1b[0m\x1b[34mnot')
    })
  })

  describe('readConfigFile', function() {
    it('should read and set the levels of the config file', function() {
      let config = {
        'globalLevel': 'silent',
        'a': 'warn',
        'b': 'debug'
      }

      let configJson = JSON.stringify(config)
      fs.writeFileSync(configFileName(), configJson, 'utf8')

      readConfigFile()
      
      expect(Log.levels['globalLevel']).to.equal('silent')
      expect(Log.levels['a']).to.equal('warn')
      expect(Log.levels['b']).to.equal('debug')
    })

    it('should only set values if they evaluate to true', function() {
      Log.globalLevel = 'error'

      let config = {
        'globalLevel': '',
        'a': false,
        'b': 0,
        'c': null
      }

      let configJson = JSON.stringify(config)
      fs.writeFileSync(configFileName(), configJson, 'utf8')

      readConfigFile()
      
      expect(Log.globalLevel).to.equal('error')
      expect(Log.levels['globalLevel']).to.be.undefined
      expect(Log.levels['a']).to.be.undefined
      expect(Log.levels['b']).to.be.undefined
      expect(Log.levels['c']).to.be.undefined
    })
  })

  describe('loglevels.json file watcher', function() {
    it('should re-read the content of loglevels.json', async function() {
      let config = {
        'globalLevel': 'debug',
        'c': 'info',
        'd': 'insane'
      }

      let configJson = JSON.stringify(config)

      fs.writeFileSync(configFileName(), configJson, 'utf8')

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(Log.globalLevel).to.equal('info')
      expect(Log.levels['globalLevel']).to.equal('debug')
      expect(Log.levels['a']).to.be.undefined
      expect(Log.levels['b']).to.be.undefined
      expect(Log.levels['c']).to.equal('info')
      expect(Log.levels['d']).to.equal('insane')

      let origConfig = {
        'globalLevel': 'silent',
        'a': 'warn',
        'b': 'debug'
      }

      let origConfigJson = JSON.stringify(origConfig)

      fs.writeFileSync(configFileName(), origConfigJson, 'utf8')
    })
  })
})