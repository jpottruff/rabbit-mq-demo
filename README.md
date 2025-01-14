# Rabbit MQ Demo

Simple JS demos from the [Getting Started docs](https://www.rabbitmq.com/tutorials) of RabbitMQ

#### [Hello World](https://www.rabbitmq.com/tutorials/tutorial-one-javascript)

_see code_

#### [Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-javascript)

Flow

1. run 2 workers
2. send in the messages

Result

- Worker 1: `msg 1`, `msg 3`, `msg 5`
- Worker 2: `msg 2`, `msg 3`

**Takeaways**

- Round Robin Distribution

  - By default, RabbitMQ will send each message to the next consumer, in sequence.
  - On average every consumer will get the same number of messages.
  - This way of distributing messages is called round-robin.

- [message acknowledgement](https://www.rabbitmq.com/tutorials/tutorial-two-javascript#message-acknowledgment) / [forgotten acknowledgement](https://www.rabbitmq.com/tutorials/tutorial-two-javascript#forgotten-acknowledgment)

- [message durability](https://www.rabbitmq.com/tutorials/tutorial-two-javascript#message-durability)

  - `durable` / `persitent`

- [fair dispatch](https://www.rabbitmq.com/tutorials/tutorial-two-javascript#fair-dispatch)
  - `prefetch`

### Relevant packages:

[amqplib](https://amqp-node.github.io/amqplib/)

## Setup

Get a temporary docker container

```bash
# latest RabbitMQ 4.0.x
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
```

## RabbitMQ CLI

You can use the [rabbitmq cli commands](https://www.rabbitmq.com/docs/cli) from within the docker container

Shell into the container:

`docker exec -it rabbitmq bash`

Common Commands:

`rabbitmqctl list_queues`

`rabbitmqctl list_queues name messages_ready messages_unacknowledged`
