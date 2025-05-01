const amqp = require("amqplib/callback_api");
const { SERVER_URL, RPC_QUEUE } = require("./config");

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

    // Specify queue
    // Note that we declare the queue here, as well. Because we might start the consumer before the publisher, we want to make sure the queue exists before we try to consume messages from it.
    var queue = RPC_QUEUE;

    channel.assertQueue(queue, {
      durable: false,
    });
    // Tell RabbitMQ not to give more than 1 message to a worker at a time
    channel.prefetch(1);

    // Consume the message(s)
    console.log(" [x] Awaiting RPC requests", queue);
    channel.consume(queue, function reply(msg) {
      var n = parseInt(msg.content.toString());
      console.log(" [.] fib(%d)", n);

      var r = fibonacci(n);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
        correlationId: msg.properties.correlationId,
      });

      channel.ack(msg);
    });
  });
});

/** This will not work for large numbers */
function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}
