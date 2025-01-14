const amqp = require("amqplib/callback_api");
const { SERVER_URL, TEST_QUEUE } = require("./config");

// Connect to server
amqp.connect(SERVER_URL, function (error0, connection) {
  if (error0) {
    throw error0;
  }

  // Create or connect to channel
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    // Setup and send message to queue
    var queue = TEST_QUEUE;
    /** Allows arbitrary messages to be sent from command line */
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });

    console.log(" [x] Sent %s", msg);

    // Close connection and exit
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
