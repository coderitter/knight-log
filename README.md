# Knight Log by Coderitter

A log library. Works in Node and in browsers.

## Install

`npm install knight-log`

## Overview

### Initialize the logger

Instantiate a new logger per file. The constructor takes the filename as parameter. Start with this logging object in your file and use it to derive loggers for classes, methods and functions from it. The given location is prepended to every log message and used to be able to set log levels for certain locations only.

```typescript
import Log from 'knight-log'

// Create a logger for your file
let log = new Log('filename.ts')

function functionName() {
  // Create a logger for a function using the file-related logger
  let l = log.fn('functionName')
}

// Create a logger for a class using the file-related logger
let classNameLogger = log.cls('ClassName')

class ClassName {

  method1() {
    // Create a logger for a method using the class-related logger
    let l = classNameLogger.mt('method1')
  }

  method2() {
    // Create a logger for a method using the file-related logger
    let l = log.cls('ClassName', 'method2')
  }
}
```

If your filename equals the class name but without the extension you can directly derive a method logger from the file logger.

```typescript
import Log from 'knight-log'

// Create your file-related logger
let log = new Log('ClassName.ts')

class ClassName {

  methodName() {
    // Create a logger for a method using the file-related logger
    let l = log.mt('methodName')
  }
}
```

### Print log messages

There are five log levels. Some of them were renamed to better fit their intended usage style.

- `error`: Print errors
- `warn`: Print warnings
- `admin` also known as `info`: Give information to an admin
- `lib` also known as `debug`: Give information to a developer who uses your code but who does not want to change it
- `dev` also known as `insane`: Give information to the developer who wants to change your code

Here you can see the corresponding methods. For the log levels `admin`, `lib` and `dev` there are also bright variants to let a message appear brighter. This works only in NodeJs, not in the browsers.

```typescript
log.error('An error occurred!', error)
log.warn('The behaviour of the code will change!') 

log.admin('Connecting to database...')
log.adminBright('Success connecting to database')

log.lib('Month is greater than march. Picking 3 day period.')
log.libBright('Going into recursion...')

log.dev('Database result looks like this', result)
log.devBright('This is important')

// Useful to highlight parameters (log level equals "lib")
log.param('parameterName', parameterValue)
```

The location given to the logger (filename, class name, ...) is prepended on every log message. Here are some examples.

```shell
Filename.ts An error occured!
Filename.ts > functionName The behaviour of the code will change!
ClassName Connected to database
ClassName.method Month is greater than march. Picking 3 day period.
Filename.ts ClassName.method Database result looks like this {...}
```

The prepended location information is also color coded depending on the log level. This works only in NodeJs, not in the browsers.

- `error`: red
- `warning`: yellow
- `admin`: white
- `lib`: cyan
- `dev`: cyan

### Set the global log level

The global log level is the default which is used if there is no other definition.

```typescript
log.globalLevel = 'error' // 'warning', 'admin', 'lib', 'dev'
```

Like in any other logging library `error` will only display errors while `warning` will display warnings and errors and so on.

### Set local log levels

There are ways to set log levels in different granularity. The code section will show the options from lowest to highest priority. This means if there are two definitions competing with each other the one with the higher priority will by chosen.

```typescript
log.levels = {
  // targeting a function name has the lowest priority
  'functionName': 'dev',

  // targeting a class name
  'ClassName': 'dev',

  // targeting a method of a class
  'ClassName.method': 'dev',

  // targeting a file
  'filename.ts': 'dev',

  // targeting a function in a particlar file
  'filename.ts > functionName': 'dev',

  // targeting a class in a particular file
  'filename.ts > ClassName': 'dev',

  // targeting a method of a particular class in a particular file
  'filename.ts > ClassName.method': 'dev'
}
```

### Set the log level through loglevels.json (NodeJs)

If you are in NodeJs you can use the file `loglevels.json` to determine the log levels. It has to be in the root of your project.

```json
{
  "globalLevel": "admin",
  "functionName": "dev",
  "ClassName": "dev",
  "ClassName.method": "dev",
  "filename.ts": "dev",
  "filename.ts > functionName": "dev",
  "filename.ts > ClassName": "dev",
  "filename.ts > ClassName.method": "dev"
}
```

The file is permanently watched for changes. This if you set a log level while your application is already running it will instantly be adopted without requiring a restart. What you need to do when your application shuts down is to close the file watcher.

```typescript
Log.stopWatcher()
```

### Set the log level on the logger directly

You can also set the log level directly on the logger but which is discouraged because it will be split the log level definition into multiple files. Use the static property `levels` instead to collect log levels in one place.

```typescript
// use the constructor parameter
let log = new Log('filename.ts', 'dev')

// or set it on the property
log.level = 'lib'
```

### Prepend additional location information

Sometimes you iterate through a loop processing different database entities. To keep track which database entity is processed at the moment you can prepend additional location information.

There is a property `location` on every logger which is an array that you can fill with arbitrary many strings which will be appended to the already existing location information (filename, class name, ...).

```typescript
for (let entity of entities) {
  // the location property is just an array consisting of strings
  l.location = [ 'id', entity.id ]
  // you can define a separator which is used when the array is joined into a string
  l.locationSeparator = ': '
  l.lib('The next entity is being processed...')
}
```

Prints this output.

```shell
ClassName.method ( id: 1  ) The next entity is being processed...
```

### Use colors in the first message parameter

The first given message parameter may contain color definitions.

```typescript
log.debug('The value was color(magenta)undefined')
```

This will output the word `undefined` with a magenta color.

The following colors are supported. Those are the standard console colors: `reset`, `bright`, `dim`, `underscore`, `blink`, `reverse`, `hidden`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
