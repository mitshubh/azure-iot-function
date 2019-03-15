'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var connectionString = <INSERT_CONNECTION_STRING -- REDACTED>;
var client = Client.fromConnectionString(connectionString);
var targetDevice = 'MyAndroidDevice';

module.exports = function (context, myBlob) {
    context.log("Entered!")

    var result = "";
    
    client.open(function (err) {
        if (err) {
            context.log('Could not connect: ' + err.message);
        } else {
            context.log('Client connected');
            var blobData = JSON.stringify(myBlob);
            var deviceLoc1 =blobData.data[0];
            var deviceLoc2 =blobData.data[1];
            var latitude1 = deviceLoc1.coordinates.latitude;
            var longitude1 = deviceLoc1.coordinates.longitude;
            var altitude1 = deviceLoc1.coordinates.altitude;

            var latitude2 = deviceLoc2.coordinates.latitude;
            var longitude2 = deviceLoc2.coordinates.longitude;
            var altitude2 = deviceLoc2.coordinates.altitude;

            if (latitude1 === latitude2 && longitude1 === longitude2) {
                if (altitude1>altitude2) {
                    result = "win";
                } else {
                    result = "loss";
                }
            }
    
            var message = new Message(JSON.stringify({ key : result }));
            context.log('Sending message: ' + message.getData());
            client.send(targetDevice, message, function (err) {
                if (err) {
                    context.log(err.toString());
                } else {
                    context.log('sent c2d message');
                }
            });
        }
    });

    client.close();
    context.done();
};
