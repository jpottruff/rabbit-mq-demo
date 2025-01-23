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

    channel.assertExchange(exchange, "fanout", {
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
        channel.bindQueue(q.queue, exchange, "");

        // consume messages
        channel.consume(
          q.queue,
          function (msg) {
            if (msg.content) {
              console.log(" [x] %s", msg.content.toString());
            }
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
