import { action, Broker, Service } from '../../src';

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
  public foo(): 'foo' {
    return 'foo';
  }

  @action({ name: 'wut' })
  public bar(): 'bar' {
    return 'bar';
  }

  @action()
  public add(params: IAddParams): number {
    return params.a + params.b;
  }
}
