import { createInbox } from 'ts-nats/lib/util';
import { action, Broker, Context, Service } from '../../src';

export interface IAddParams {
  a: number;
  b: number;
}

export class ActionService extends Service {
  public name = 'coolService';

  constructor(broker: Broker) {
    super(broker);
  }

  @action()
  public foo() {
    return 'foo';
  }

  @action({ name: 'wut' })
  public bar() {
    return 'bar';
  }

  @action()
  public add(ctx: Context<IAddParams>) {
    return ctx.params.a + ctx.params.b;
  }
}
