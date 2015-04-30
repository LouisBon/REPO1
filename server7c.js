//  STATIC FILE SERVER NO 7 WITH WEBSOCKETS/SOCKET.IO SUPPORT.  (SERVER VERSION C)
//2015 R3Plex Inc.


//Load Key Modules
var http = require('http'),

    path = require('path'),

    fs = require('fs'),

    util = require('util');

 var parse=require('url').parse;
 var join=require('path').join;
 var root=__dirname;
 var url;
 var filePath;

 // set port dynamically for Heroku and 5000 for local
 var port = ( process.env.PORT||5000 );

// creation of server, listening at 5000 for HEROKU...
var Server=http.createServer(_handler).listen(port);

console.log(' Server 7 running at http://127.0.0.1:5000/');



function _handler(req, res) {




        contentType = "text/plain",

        filePath = "";

// SUPPORT FOR GET ONLY NOW, later more to be added

        if (req.method !== 'GET') { //If the request method doesn't equal 'GET'

            res.writeHead(405); //Write the HTTP status to the response head

            res.end('Unsupported request method', 'utf8'); //End and send the response

            return;

        }

        console.log('req.url: '+ req.url);


        if ('.' + req.url !== './') {




            var url= parse(req.url);

            console.log('parsedurl  '+ url);
            var filePath= join(root,url.pathname);

            console.log('filePath:  '+ filePath);
            fs.exists(filePath, serveRequestedFile);

        } else {

            res.writeHead(400);

            res.end('A file must be requested', 'utf8');

            return;

        }



        function serveRequestedFile(file) {

            if (file === false) {

                res.writeHead(404);

                res.end();

                return;

            }



            var stream = fs.createReadStream(filePath);



            stream.on('error', function(error) {

                res.writeHead(500);

                res.end();

                return;

            });


 //  MIME TYPES definition for now, later more to be added
 
            var mimeTypes = {

                '.js' : 'text/javascript',

                '.css' : 'text/css',

                '.gif' : 'image/gif',
                
                '.babylon' : 'application/babylon',
                
                '.babylonmesh' : 'application/babylon'

            };



            contentType = mimeTypes[path.extname(filePath)];



            res.setHeader('Content-Type', contentType);

            res.writeHead(200);

               stream.pipe(res);
                stream.on('end', function() {
                res.end();


                return;

            });



        }



}

    //    Loading scoket.io
    io = require('socket.io').listen(Server),

     //Socket.io emits this event when a connection is made.
        io.sockets.on('connection', function (socket) {

  // Emit a message to send it to the client.indicating connection is DONE !
   socket.emit('ping', { msg: 'SERVER MESSAGE. YOU ARE CONNECTED TO ME THRU WEB SOCKETS.' });


  // Console Log messages from the client.

  socket.on('authorization', function (data) {
    console.log(data.msg);

 socket.emit('authorization', { msg: ' SERVER MESSAGE : 2. TRIGGER or STOP CUBE' });

});




});


