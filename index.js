var net = require('net');


var request = require('request');
var options = {
    host: 'api.dev',
    port: 80,
    path: '/log',
    method: 'POST'
    //json: true
};

var clients = [];

var server = net.createServer(function(socket) {

  socket.name = socket.remoteAddress + ":" + socket.remotePort
  clients.push(socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    broadcast(data, socket);
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " left the chat.\n");
  });

  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }


});

server.listen(1337, '127.0.0.1');
