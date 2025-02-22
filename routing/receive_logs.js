const amqp = require("amqplib/callback_api");
const {
  SERVER_URL,
  TEST_EXCHANGE,
  SEVERITY_INFO,
  SEVERITY_WARNING,
  SEVERITY_ERROR,
} = require("./config");

var args = process.argv.slice(2);

// Exit if no severity to listen to is specified
if (args.length == 0) {
  console.log(
    `Usage: npm run routing:subscribe [${SEVERITY_INFO}] [${SEVERITY_WARNING}] [${SEVERITY_ERROR}]`
  );
  process.exit(1);
}

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

    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    // Generate a queue with a random name EXAMPLE `amq.gen-JzTY20BRgKO-HjmUJj0wLg`
    // NOTE: this queue will be deleted when the connection that declared it closes
    channel.assertQueue(
      // queue name (random)
      "",
      // options
      {
        exclusive: true,
      },
      // callback
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );

        // bind the queue to the exchange
        // NOTE: routing keys to be provided as command line arguments
        args.forEach(function (severity_input) {
          console.log("Listening for routing key:", severity_input);
          channel.bindQueue(q.queue, exchange, severity_input);
        });

        // consume messages
        channel.consume(
          q.queue,
          function (msg) {
            console.log(
              " [x] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString()
            );
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
