import 'mocha'
import { Log } from '../src/log'

after(function () {
    // Stop the file watcher, otherwise the test process will not finish
    Log.stopWatcher()
})
