
'use strict';

var express = require('express');
var app = express();
var path = require('path');
var expressWs = require('express-ws')(app);
var azure = require('azure-storage');


app.use(express.static('../public'))

var queueSvc = azure.createQueueService(process.env.eventsStorageAccount);

let sockets = [];

app.ws('/echo', function(ws, req) {  
    sockets.push(ws);

    ws.on('close', (code, reason) => {
		let i = sockets.indexOf(ws);

        if(i !== -1) {
            sockets = sockets.splice(i, 1);
        }
	});
});

function getFromQueue() {
    console.log('Get from queue');

    queueSvc.getMessages('events-q', function(error, result, response){
        if(!error){
            if(result.length > 0) {
                let message = result[0];

                let messageText = Buffer.from(message.messageText, 'base64').toString('utf8');


                sockets.forEach(s => {
                    s.send(messageText);
                });
                
                queueSvc.deleteMessage('events-q', message.messageId, message.popReceipt, function(error, response){
                    if(!error){
                        console.log('message deleted');
                    }
                });
            }
        }
    });

    setTimeout(getFromQueue, 5000);
};

getFromQueue();



module.exports = app;