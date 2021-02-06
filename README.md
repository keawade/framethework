# Framethework

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/keawade/framethework/CI)](https://github.com/keawade/framethework/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/keawade/framethework)](https://github.com/keawade/framethework/blob/main/LICENSE)

Framethework is a microservices framework built on top of [NATS](https://nats.io/).

Using Framethework requires a NATS server. All examples assume a NATS server is
already running unless otherwise specified.

## Usage

This basic example shows how to create a small `math` service to add two numbers
and call it locally.

```typescript
import { action, Broker, Service } from '@keawade/framethework';

// Write a service
class MathService extends Service {
  public name = 'math';

  @action()
  public add(params: { a: number, b: number }): number {
    return params.a + params.b;
  }
}

// Create a broker
const broker = new Broker();

// Start the broker with your service(s)
broker.start([MathService])
  // Call the service
  .then(() => broker.call('math.add', { a: 5, b: 3 }))
  // Print the response
  .then(res => console.log('5 + 3 =', res))
  .catch(err => console.error(`Error occurred! ${err.message}`));
```

## `framethework-runner`

Framethework Runner is a utility that helps you run Framethework services. With
it you don't need to create a Broker instance. Instead you can simply call the
`framethework-runner` with paths to your service class files and it will automatically
create a broker and load your services.

```shell
framethework-runner ./path/to/MyService.js
```

## Things I want to implement

- Middlewares
- Not found errors
- API gateway
- Action JSON schema param validation
- OpenAPI docs generation from action params
