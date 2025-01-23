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
  });

  // Close connection and exit
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
