const amqp = require("amqplib/callback_api");
const { SERVER_URL, TEST_EXCHANGE } = require("./config");

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

    // Set up a named exchange
    var exchange = TEST_EXCHANGE;
    /** Allows arbitrary messages to be sent from command line */
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    // Specify to publish messages to TEST_EXCHANGE instead of the default nameless one
    // NOTE: necessary when working with named exchanges as they must exist
    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });

    // The second paramter ("") means we don't want to send the message to any specific queue - just publish it to the TEST_EXCHANGE
    channel.publish(exchange, "", Buffer.from(msg));

    console.log(" [x] Sent %s", msg);
  });

  // Close connection and exit
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
