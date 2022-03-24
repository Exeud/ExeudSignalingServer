// Muaz Khan      - www.MuazKhan.com
// MIT License    - www.WebRTC-Experiment.com/licence
// Documentation  - github.com/muaz-khan/RTCMultiConnection

var isUseHTTPs = !(!!process.env.PORT || !!process.env.IP);

var server = require(isUseHTTPs ? 'https' : 'http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');


const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('./node_scripts/index.js');


// configuration
const jsonPath = {
    config: 'config.json',
    logs: 'logs.json'
};

const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;

var config = getValuesFromConfigJson(jsonPath);
config = getBashParameters(config, BASH_COLORS_HELPER);

// 'createServer' callback as js function
function serverHandler(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    var stats;

    try {
        stats = fs.lstatSync(filename);
    } catch (e) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('404 Not Found: ' + path.join('/', uri) + '\n');
        response.end();
        return;
    }

    if (fs.statSync(filename).isDirectory()) {
        response.writeHead(404, {
            'Content-Type': 'text/html'
        });

    }


    fs.readFile(filename, 'binary', function(err, file) {
        if (err) {
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        response.writeHead(200);
        response.write(file, 'binary');
        response.end();
    });
}

// server specification
var app;
if (isUseHTTPs) {
    var options = {
        key: fs.readFileSync(path.join(__dirname, 'ssl/privatekey.key')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl/certificate.crt'))
    };
    app = server.createServer(options, serverHandler);
} else app = server.createServer(serverHandler);

// socket definition
const io = require("socket.io")(app, {  origin: ["http://localhost:3000", "https://rtcmulticonnection-sockets.herokuapp.com", "https://ciao-react-xr.herokuapp.com"],
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "http://localhost:300/",
            "Access-Control-Allow-Credentials": true.valueOf
        };
        res.writeHead(200, headers);
        res.end();
    }
});


// server listening sequence
RTCMultiConnectionServer.beforeHttpListen(app, config);

app = app.listen(3000 || process.env.PORT || 9001, process.env.IP || "0.0.0.0", function() {
  if (process.env.DYNO) {
    fs.openSync('/tmp/app-initialized', 'w');
  }
  console.log('Node app is running on port ' + process.env.PORT);
  RTCMultiConnectionServer.afterHttpListen(app, config);

});

// Socket connection and link to RTCMultiConnectionServer
io.on('connection', function (socket) {
    console.info(`socket: ${socket.id} connected`);
    RTCMultiConnectionServer.addSocket(socket, config);

    const params = socket.handshake.query;

    if (!params.socketCustomEvent) {
        params.socketCustomEvent = 'custom-message';
    }

    socket.on(params.socketCustomEvent, function(message) {
        socket.broadcast.emit(params.socketCustomEvent, message);
    });

    socket.on('disconnect', function () {
        console.info('disconnected');
    });

    socket.on('login', message => {
        socket.emit('login', {message: message});
    })
});