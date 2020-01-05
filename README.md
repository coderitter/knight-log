# Mega Nice Log

A mega nice log library. Works in Node and in browsers.

## Install

`npm install mega-nice-log`

## Overview

### Instantiate a logger

Instantiate a new logger per file. The constructor takes its filename as the parameter. When you are in Node simply use `__filename`.

```typescript
import Log from 'mega-nice-log'

let log = new Log(__filename)
```

When you are in a browser depict the filename.

```typescript
import Log from 'mega-nice-log'

let log = new Log('HttpServer.ts')
```

### Log

Now you can log. Here are the five log levels that you can use.

- `log.error`: For errors
- `log.warning`: For warnings
- `log.info`: For information that you always want to see in your log. May help the admin.
- `log.debug`: For very fine grained information about the execution of the code.
- `log.insane`: For very detailed and lengthy output that you only want to see if it is really relevant. When you are debugging exactly that file.

Like in any other logging library `error` will only print errors while `warning` will print errors and warnings and so on.

### Prepended log information

The logger will prepend the filename without its extension assuming it is equal to a class name.

```
HttpServer$ Starting service...
HttpServer$ Running on port 80
```

If your file contains several classes you can depict a class name.

```typescript
let l = log.cls('Request)
l.debug('this.url =', this.url)
```

```
HttpServer.ts > Request$ this.url = 'http://mega-nice.com/json'
```

Additionally you can and you always should depict the name of the function the logger is logging in.

```typescript
let l = log.fn('handler')
l.debug('Handling incoming request...')
l.debug('request =', request)
```

```
HttpServer.ts > HttpServer$ Entering HttpServer.handler
HttpServer.ts > HttpServer.handler$ Handling incoming request...
HttpServer.ts > HttpServer.handler$ request = Request { url: 'http://mega-nice.com/json' }
```

### Different color per log level

The prepended information (filename, class name, function name) will be printed in different colors corresponding to the used log level.

- `error`: red
- `warning`: yellow
- `info`: white
- `debug`: cyan
- `insane`: cyan

### Set the log level

You can set the log level directly in the constructor of the logger.

```typescript
let log = new Log(__filename, 'insane')
```

Or you can set it on a static property on the Log class.

```typescript
Log.levels = {
  'HttpServer.ts': 'info',
  'HttpServer': 'debug',
  'HttpServer.handler': 'insane'
}
```

You can either depict the filename, the class name or the function name in conjunction with its class name.

### Set a global log level

You can set a global log level which will be used if there is no other declaration.

```typescript
Log.globalLevel = 'warning'
```

### Use color in the first log message

The first given message parameter may contain color definitions.

```typescript
log.debug('The value was color(magenta)undefined')
```

This will output the word `undefined` with a magenta color.

The following colors are supported. Those are the standard console colors.

- `reset`
- `bright`
- `dim`
- `underscore`
- `blink`
- `reverse`
- `hidden`
      
- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
      
- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
