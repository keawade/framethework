import { action, Service } from '@keawade/framethework';

interface IAddParams {
  a: number;
  b: number;
}

export default class MathService extends Service {
  public name = 'math';

  @action()
  public add(params: IAddParams): number {
    return params.a + params.b;
  }
}
