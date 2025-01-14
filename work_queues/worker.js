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

    // Specify queue
    // Note that we declare the queue here, as well. Because we might start the consumer before the publisher, we want to make sure the queue exists before we try to consume messages from it.
    var queue = TEST_QUEUE;

    channel.assertQueue(queue, {
      durable: true,
    });

    // Consume the message(s)
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      function (msg) {
        /** Helper function - will fake 1sec of work for every dot (".") in the message */
        var secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        // Fake work
        setTimeout(() => console.log(" [x] Done"), secs * 1000);
      },
      {
        // automatic acknowledgment mode,
        // see /docs/confirms for details
        noAck: true,
      }
    );
  });
});
