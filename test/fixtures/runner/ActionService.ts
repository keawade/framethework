import { action, Service } from '../../../src';

export interface IAddParams {
  a: number;
  b: number;
}

export default class ActionService extends Service {
  public name = 'actionService';

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
