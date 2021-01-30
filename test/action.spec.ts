import { Broker } from '../src';
import { ActionService, IAddParams } from './fixtures/ActionService';

describe('action decorator', () => {
  let broker: Broker;

  beforeEach(async () => {
    broker = new Broker({ logger: false });
    await broker.start([ActionService]);
  });

  afterEach(async () => {
    await broker.stop();
  });

  it('should respond to call on vanilla action', async () => {
    const response = await broker.call('coolService.foo');

    const expected = 'foo';
    expect(response).toBe(expected);
  });

  it('should respond to call on action with custom name', async () => {
    const response = await broker.call('coolService.wut');

    const expected = 'bar';
    expect(response).toBe(expected);
  });

  it('should be able to use params', async () => {
    const response = await broker.call<IAddParams, number>('coolService.add', { a: 1, b: 2 });

    const expected = 3;
    expect(response).toBe(expected);
  });
});
