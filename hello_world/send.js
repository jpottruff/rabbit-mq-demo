const amqp = require("amqplib/callback_api");

// Connect to server
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  // Create or connect to channel
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    // Setup and send message to queue
    var queue = "hello";
    var msg = "Hello world";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);

    // Close connection and exit
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
