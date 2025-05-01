const amqp = require("amqplib/callback_api");
const { SERVER_URL, RPC_QUEUE } = require("./config");

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js <num>");
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

    // Setup and send message to queue
    var queue = RPC_QUEUE;
    var reply_to = "named_rpc_q"; // This could be empty as well ""

    channel.assertQueue(
      reply_to,
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }

        var correlationId = generateUuid();
        var num = parseInt(args[0]);
        console.log(" [x] Requesting fib(%d)", num);

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.properties.correlationId == correlationId) {
              console.log(
                "reply_to: %s [.] correlationId %s",
                reply_to,
                correlationId
              );
              console.log(" [.] Got %s", msg.content.toString());
              setTimeout(function () {
                connection.close();
                process.exit(0);
              }, 500);
            }
          },
          { noAck: true }
        );

        channel.sendToQueue(queue, Buffer.from(num.toString()), {
          correlationId: correlationId,
          replyTo: q.queue,
        });
      }
    );
  });
});

/** Not foolproof but will do */
function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
