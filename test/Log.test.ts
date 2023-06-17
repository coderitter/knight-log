import { expect } from 'chai'
import 'mocha'
import { Log, LogColor } from '../src/log'

describe('Log', function () {
    beforeEach(function () {
        Log.globalLevel = 'admin'
        Log.levels = {}
    })

    describe('level', function () {
        it('should use the global level', function () {
            Log.globalLevel = 'error'

            let log = new Log('Filename.ts')

            expect(log.level).to.equal('error')
        })

        it('should use the corresponding level for the function', function () {
            Log.globalLevel = 'error'
            Log.levels['function'] = 'warn'

            let log = new Log('Filename.ts')
            log.fnName = 'function'

            expect(log.level).to.equal('warn')
        })

        it('should use the corresponding level for the filename as classname', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename'] = 'warn'

            let log = new Log('Filename.ts')

            expect(log.level).to.equal('warn')
        })

        it('should use the corresponding level for the explicitly set class name', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename'] = 'warn'
            Log.levels['Class'] = 'admin'

            let log = new Log('Filename.ts')
            log.clsName = 'Class'

            expect(log.level).to.equal('admin')
        })

        it('should use the corresponding level for filename as class name and the set method', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename.method'] = 'warn'

            let log = new Log('Filename.ts')
            log.mtName = 'method'

            expect(log.level).to.equal('warn')
        })

        it('should use the corresponding level for the explicitly set class name and method', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename.method'] = 'warn'
            Log.levels['Class.method'] = 'admin'

            let log = new Log('Filename.ts')
            log.mtName = 'method'
            log.clsName = 'Class'

            expect(log.level).to.equal('admin')
        })

        it('should use the corresponding level for the filename', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename.ts'] = 'warn'

            let log = new Log('Filename.ts')

            expect(log.level).to.equal('warn')
        })

        it('should use the corresponding level for the filename instead of the function name', function () {
            Log.globalLevel = 'error'
            Log.levels['function'] = 'warn'
            Log.levels['Filename.ts'] = 'admin'

            let log = new Log('Filename.ts')
            log.fnName = 'function'

            expect(log.level).to.equal('admin')
        })

        it('should use the corresponding level for the filename instead of class name and method', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename'] = 'warn'
            Log.levels['Class'] = 'admin'
            Log.levels['Class.method'] = 'dev'
            Log.levels['Filename.ts'] = 'creator'

            let log = new Log('Filename.ts')
            log.clsName = 'Class'
            log.mtName = 'method'

            expect(log.level).to.equal('creator')
        })

        it('should use the corresponding level for filename and function', function () {
            Log.globalLevel = 'error'
            Log.levels['function'] = 'warn'
            Log.levels['Filename.ts'] = 'admin'
            Log.levels['Filename.ts > function'] = 'dev'

            let log = new Log('Filename.ts')
            log.fnName = 'function'

            expect(log.level).to.equal('dev')
        })

        it('should use the corresponding level for the filename and class', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename'] = 'warn'
            Log.levels['Class'] = 'admin'
            Log.levels['Filename.ts'] = 'dev'
            Log.levels['Filename.ts > Class'] = 'creator'

            let log = new Log('Filename.ts')
            log.clsName = 'Class'

            expect(log.level).to.equal('creator')
        })

        it('should use the corresponding level for the filename, class and method', function () {
            Log.globalLevel = 'error'
            Log.levels['Filename'] = 'warn'
            Log.levels['Class'] = 'warn'
            Log.levels['Filename.method'] = 'warn'
            Log.levels['Class.method'] = 'warn'
            Log.levels['Filename.ts'] = 'admin'
            Log.levels['Filename.ts > Class'] = 'dev'
            Log.levels['Filename.ts > Class.method'] = 'creator'

            let log = new Log('Filename.ts')
            log.clsName = 'Class'
            log.mtName = 'method'

            expect(log.level).to.equal('creator')
        })
    })

    describe('createMessage', function () {
        it('should use the filename if nothing else is set', function () {
            let log = new Log('Filename.ts')
            let str = log.createMessage(LogColor.cyan, 'message')
            expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m message\x1b[0m')
        })

        it('should use the function name if set', function () {
            let log = new Log('Filename.ts')
            log.fnName = 'function'
            let str = log.createMessage(LogColor.cyan, 'message')
            expect(str).to.equal('\x1b[36mFilename.ts > function\x1b[0m message\x1b[0m')
        })

        it('should use the method name if set and use the filename without extension as class name', function () {
            let log = new Log('Filename.ts')
            log.mtName = 'method'
            let str = log.createMessage(LogColor.cyan, 'message')
            expect(str).to.equal('\x1b[36mFilename.method\x1b[0m message\x1b[0m')
        })

        it('should use the method name if set and use the filename without extension as class name', function () {
            let log = new Log('Filename.ts')
            log.clsName = 'Class'
            log.mtName = 'method'
            let str = log.createMessage(LogColor.cyan, 'message')
            expect(str).to.equal('\x1b[36mFilename.ts > Class.method\x1b[0m message\x1b[0m')
        })

        it('should add the location', function () {
            let log = new Log('Filename.ts')
            log.location = ['Object1=a', 'Object2=b']
            log.locationSeparator = '; '
            let str = log.createMessage(LogColor.cyan, 'message')
            expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m ( Object1=a; Object2=b ) message\x1b[0m')
        })

        it('should not dim the message if there is no additional optional parameter', function () {
            let log = new Log('Filename.ts')
            let str = log.createMessage(LogColor.cyan, 'message')
            expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m message\x1b[0m')
        })

        it('should dim the message if there are additional optional parameters', function () {
            let log = new Log('Filename.ts')
            let str = log.createMessage(LogColor.cyan, 'message', 1)
            expect(str).to.equal('\x1b[36mFilename.ts\x1b[0m \x1b[2mmessage\x1b[0m')
        })
    })

    describe("Log messages", function() {
        it('should print or print NOT regarding the chosen log level', function() {
            let log = new Log('Test')

            Log.globalLevel = 'silence'
            log.error('Should NOT print "error" because log level is "silence"')
            log.warn('Should NOT print "warn" because log level is "silence"')
            log.admin('Should NOT print "admin" because log level is "silence"')
            log.dev('Should NOT print "dev" because log level is "silence"')
            log.creator('Should NOT print "creator" because log level is "silence"')

            Log.globalLevel = 'error'
            log.error('Should print "error" because log level is "error"')
            log.warn('Should NOT print "warn" because log level is "error"')
            log.admin('Should NOT print "admin" because log level is "error"')
            log.dev('Should NOT print "dev" because log level is "error"')
            log.creator('Should NOT print "creator" because log level is "error"')

            Log.globalLevel = 'warn'
            log.error('Should print "error" because log level is "warn"')
            log.warn('Should print "warn" because log level is "warn"')
            log.admin('Should NOT print "admin" because log level is "warn"')
            log.dev('Should NOT print "dev" because log level is "warn"')
            log.creator('Should NOT print "creator" because log level is "warn"')

            Log.globalLevel = 'admin'
            log.error('Should print "error" because log level is "admin"')
            log.warn('Should print "warn" because log level is "admin"')
            log.admin('Should print "admin" because log level is "admin"')
            log.dev('Should NOT print "dev" because log level is "admin"')
            log.creator('Should NOT print "creator" because log level is "admin"')

            Log.globalLevel = 'dev'
            log.error('Should print "error" because log level is "dev"')
            log.warn('Should print "warn" because log level is "dev"')
            log.admin('Should print "admin" because log level is "dev"')
            log.dev('Should print "dev" because log level is "dev"')
            log.creator('Should NOT print "creator" because log level is "dev"')

            Log.globalLevel = 'creator'
            log.error('Should print "error" because log level is "creator"')
            log.warn('Should print "warn" because log level is "creator"')
            log.admin('Should print "admin" because log level is "creator"')
            log.dev('Should print "dev" because log level is "creator"')
            log.creator('Should print "creator" because log level is "creator"')
        })

        it('should print the correct log message', function() {
            Log.globalLevel = 'dev'

            let log = new Log('Test')

            console.log(`It should print: Parameter: Test value`)
            log.param('Test', 'value')

            console.log(`It should print: Calling "test"...`)
            log.calling('test')

            console.log(`It should print: Calling "test"... optionalParam`)
            log.calling('test', 'optionalParam')

            console.log(`It should print: Called "test"...`)
            log.called('test')

            console.log(`It should print: Called "test"... optionalParam`)
            log.called('test', 'optionalParam')

            console.log(`It should print: Returning...`)
            log.returning()

            console.log(`It should print: Returning "test"... optionalParam`)
            log.returning('test', 'optionalParam')
        })
    })
})
