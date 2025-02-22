const amqp = require("amqplib/callback_api");
const { SERVER_URL, TEST_EXCHANGE, SEVERITY_INFO } = require("./config");

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

    // Input parsing
    var args = process.argv.slice(2);

    // Assume when running from the command line in input will be: <serverity> <message>
    // EXAMPLE: `warning its warm`
    // EXAMPLE: `error EVERYTHINGS ON FIRE`
    const severity_input = args[0];
    const msg_input = args.slice(1).join(" ");
    var severity = args.length > 0 ? severity_input : SEVERITY_INFO;
    var msg = msg_input || "Hello World!";

    // Specify to publish messages to TEST_EXCHANGE instead of the default nameless one
    // NOTE: using a DIRECT exchange
    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    // Publish the routing key / message (routing key will be parsed from commpand line input)
    channel.publish(exchange, severity, Buffer.from(msg));

    console.log(" [x] Sent %s", severity, msg);
  });

  // Close connection and exit
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
