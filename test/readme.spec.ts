import { action, Broker, Service } from '../src';

describe('readme example', () => {
  it('should run without crashing', async () => {
    interface IAddParams {
      a: number;
      b: number;
    }

    class MathService extends Service {
      public name = 'math';

      @action()
      public add(params: IAddParams): number {
        return params.a + params.b;
      }
    }

    const broker = new Broker();
    broker.registerService(MathService);
    await broker.start();

    const result: number = await broker.call('math.add', { a: 5, b: 3 });

    expect(result).toBe(8);

    await broker.stop();
  });
});
