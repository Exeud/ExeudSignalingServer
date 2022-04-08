<a href="https://www.rtcmulticonnection.org/"><img src="https://i.imgur.com/MFfRBSM.png" /></a>

## RTCMultiConnection Socket.io Server

[![npm](https://img.shields.io/npm/v/rtcmulticonnection-server.svg)](https://npmjs.org/package/rtcmulticonnection-server) [![downloads](https://img.shields.io/npm/dm/rtcmulticonnection-server.svg)](https://npmjs.org/package/rtcmulticonnection-server)

> Since version `1.3.1`: now `rtcmulticonnection-server` does not creates any HTTP server.
> 
> Now you need to use this: `require('rtcmulticonnection-server').addSocket(socket)` where `socket` is your socket.io connection object.
> 
> It means  that now you can integrate `rtcmulticonnection-server` inside any socket.io application or expressjsj/angular frameworks.

```sh
npm install rtcmulticonnection-server

# either
node server.js --help

# or
require('rtcmulticonnection-server').addSocket(socket);
```

**Installation Guide:**

* https://github.com/muaz-khan/RTCMultiConnection-Server/wiki

## Other socket.io servers
Island Collective fork
```javascript
connectin.socketURL = 'https://rtcmulticonnection-sockets.herokuapp.com:443/';
```

Others
```javascript
connectin.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
connectin.socketURL = 'https://webrtcweb.com:9002/';
```

## `config.json`

* https://github.com/muaz-khan/RTCMultiConnection-Server/wiki/config.json

