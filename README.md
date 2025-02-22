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

#### [Publish / Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-javascript)

Flow

1. run 2 subscribers
2. send in the messages

Result

- Subscriber 1: `msg 1`, `msg 2`, ...
- Subscriber 2: `msg 1`, `msg 2`, ...

**Takeaways**

- can publish messages to many receivers via named `fanout` exchanges

#### (Routing w/ amqp.node client)[https://www.rabbitmq.com/tutorials/tutorial-four-javascript]

This example works off the assumption a `severity` (routing key) will be sent in as an argument.

The possible values are `info | warning | error`

Flow

1. run 2 subscribers
   `npm run routing:subscribe:all`
   `npm run routing:subscribe:error`

2. send in messages
   Expected format: `npm run routing:publish <severity> <message>`

Run
`npm run routing:publish`
`npm run routing:publish warning its warm `
`npm run routing:publish error ON FIRE`
`npm run routing:publish something anything`

_NOTE: the last message will not be shown as the `something` routing key is not being bound to_

Result

- Subscriber 1 (`info | warning | error`): `Hello World`, `its warm`, `ON FIRE`
- Subscriber 2 (`error`): `ON FIRE`

### Relevant packages:

[amqplib](https://amqp-node.github.io/amqplib/)

## Setup

Get a temporary docker container

```bash
# latest RabbitMQ 4.0.x
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
```

(Optional )Run via `docker-compose`

```bash
cd ./docker
docker-compose up -d
```

## RabbitMQ CLI

You can use the [rabbitmq cli commands](https://www.rabbitmq.com/docs/cli) from within the docker container

Shell into the container:

`docker exec -it rabbitmq bash`

Common Commands:

`rabbitmqctl list_queues`

`rabbitmqctl list_queues name messages_ready messages_unacknowledged`

`rabbitmqctl list_exchanges`

`rabbitmqctl list_bindings`
