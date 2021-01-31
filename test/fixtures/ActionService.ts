import { action, Broker, IActionContext, Service } from '../../src';

export interface IAddParams {
  a: number;
  b: number;
}

export class ActionService extends Service {
  public name = 'actionService';

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
  public add(ctx: IActionContext<IAddParams>) {
    return ctx.params.a + ctx.params.b;
  }
}
