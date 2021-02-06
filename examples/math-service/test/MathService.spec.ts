import { Broker } from '@keawade/framethework';

describe('MathService', () => {
  let broker: Broker;

  beforeEach(async () => {
    broker = new Broker();
    await broker.start();
  });

  afterEach(async () => {
    await broker.stop();
  });

  it('should add two numbers', async () => {
    const response = await broker.call('math.add', { a: 3, b: 5 });

    expect(response).toBe(8);
  });
});
