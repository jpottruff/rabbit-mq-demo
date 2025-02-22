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
  console.log(`Usage: npm run routing:subscribe <facility>.<severity>`);
  console.log(
    `Severity options: ${SEVERITY_INFO} | ${SEVERITY_WARNING} | ${SEVERITY_ERROR}`
  );
  console.log(
    `Facility options: <any string> but look in the npm scripts for ideas...`
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

    channel.assertExchange(exchange, "topic", {
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
        args.forEach(function (topic_key) {
          console.log("Listening for routing key:", topic_key);
          channel.bindQueue(q.queue, exchange, topic_key);
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
