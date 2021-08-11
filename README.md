# Knight Log by Coderitter

A log library. Works in Node and in browsers.

## Install

`npm install knight-log`

## Overview

### Initialize the logger

Instantiate a new logger per file. The constructor takes the filename as parameter. Start with this logging object in your file and use it to derive loggers for classes, methods and functions. The given location is prepended to every log message and used to be able to set log levels for certain locations only.

```typescript
import Log from 'knight-log'

// Instantiate a logger for the file
let log = new Log('filename.ts')

function functionName() {
  // Derive a logger for a function
  let l = log.fn('functionName')
}

// Derive a logger for a class
let classNameLogger = log.cls('ClassName')

class ClassName {

  methodName1() {
    // Derive a logger for a method
    let l = classNameLogger.mt('methodName1')
  }

  methodName2() {
    // Derive a logger for a method using the file logger
    let l = log.cls('ClassName', 'methodName2')
  }
}
```

If your filename equals the class name but without the extension you can directly derive a method logger from the file logger.

```typescript
import Log from 'knight-log'

// Define the base logger for the file
let log = new Log('ClassName.ts')

class ClassName {

  methodName() {
    // Derive a logger for a method
    let l = log.mt('methodName')
  }
}
```

### Print log messages

There are five log levels. The commonly known log level `info` is renamed to `admin`, `debug` to `libuser` and `insane` to `dev`.

```typescript
// For errors
log.error('An error occurred!')

// For warnings
log.warning('The behaviour of the code will change!') 

// Display information the admin needs to see to make decisions.
log.admin('Connected to database') 

// Display information the user of your code needs to understand assuming your code is bug free.
log.libUser('Month is greater than march. Picking 3 day period.')

// Display information a developer of your code needs to find bugs and improve on it.
log.dev('Database result looks like this', result)

/* Additional methods which alter the colors of the message (works only in NodeJs) */

// Useful to highlight parameters (log level equals "user")
log.param('parameterName', parameterValue)

// Useful to highlight the end of a function (log level equals "user")
log.returning('Returning...', returnValue) 

// Useful to highlight variable values (log level equals "dev")
log.var('variableName', variableValue)
```

The location given to the logger (filename, class name, ...) is prepended on every log message. Here are some examples.

```shell
Filename.ts An error occured!
Filename.ts > functionName The behaviour of the code will change!
ClassName Connected to database
ClassName.method Month is greater than march. Picking 3 day period.
Filename.ts ClassName.method Database result looks like this {...}
```

The prepended location information is also color coded depending on the log level.

- `error`: red
- `warning`: yellow
- `admin`: white
- `libuser`: cyan
- `dev`: cyan

### Set the global log level

The global log level is the fallback level which is always used if there are no other definitions.

```typescript
log.globalLevel = 'error' // 'warning', 'admin', 'libuser', 'dev'
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
log.level = 'libuser'
```

### Prepend additional location information

Sometimes you iterate through a loop processing different database entities. To keep track which database entity is processed at the moment you can prepend additional location information.

There is a property `location` on every logger which is an array that you can fill with arbitrary many strings which will be appended to the already existing location information (filename, class name, ...).

```typescript
for (let entity of entities) {
  // the location property is just an array consisting of strings
  l.location = [ entity.id ]
  l.libUser('The next entity is being processed...')
}
```

Prints this output.

```shell
ClassName.method ( 1 ) The next entity is being processed...
```

### Use colors in the first message parameter

The first given message parameter may contain color definitions.

```typescript
log.debug('The value was color(magenta)undefined')
```

This will output the word `undefined` with a magenta color.

The following colors are supported. Those are the standard console colors: `reset`, `bright`, `dim`, `underscore`, `blink`, `reverse`, `hidden`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
