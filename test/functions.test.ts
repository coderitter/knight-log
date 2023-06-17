import { expect } from 'chai'
import * as fs from 'fs'
import 'mocha'
import { configFileName, Log, readConfigFile } from '../src/log'

describe('functions', function () {
    beforeEach(function () {
        Log.globalLevel = 'admin'
        Log.levels = {}
    })

    describe('readConfigFile', function () {
        it('should read and set the levels of the config file', function () {
            let config = {
                'globalLevel': 'error',
                'a': 'admin',
                'b': 'dev',
                'c': 'creator'
            }

            let configJson = JSON.stringify(config)
            fs.writeFileSync(configFileName(), configJson, 'utf8')

            readConfigFile()

            expect(Log.levels['globalLevel']).to.equal('error')
            expect(Log.levels['a']).to.equal('admin')
            expect(Log.levels['b']).to.equal('dev')
            expect(Log.levels['c']).to.equal('creator')

            config = {
                'globalLevel': 'silent',
                'a': 'warn',
                'b': 'admin',
                'c': 'dev'
            }

            configJson = JSON.stringify(config)
            fs.writeFileSync(configFileName(), configJson, 'utf8')

            readConfigFile()

            expect(Log.levels['globalLevel']).to.equal('silent')
            expect(Log.levels['a']).to.equal('warn')
            expect(Log.levels['b']).to.equal('admin')
            expect(Log.levels['c']).to.equal('dev')
        })

        it('should only set values if they evaluate to true', function () {
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

    describe('loglevels.json file watcher', function () {
        it('should re-read the content of loglevels.json', async function () {
            let config = {
                'globalLevel': 'dev',
                'c': 'admin',
                'd': 'dev'
            }

            let configJson = JSON.stringify(config)

            fs.writeFileSync(configFileName(), configJson, 'utf8')

            await new Promise(resolve => setTimeout(resolve, 100))

            expect(Log.globalLevel).to.equal('admin')
            expect(Log.levels['globalLevel']).to.equal('dev')
            expect(Log.levels['a']).to.be.undefined
            expect(Log.levels['b']).to.be.undefined
            expect(Log.levels['c']).to.equal('admin')
            expect(Log.levels['d']).to.equal('dev')

            let origConfig = {
                'globalLevel': 'silent',
                'a': 'warn',
                'b': 'dev'
            }

            let origConfigJson = JSON.stringify(origConfig)

            fs.writeFileSync(configFileName(), origConfigJson, 'utf8')
        })
    })
})