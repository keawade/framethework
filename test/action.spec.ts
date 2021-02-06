import { Broker } from '../src';
import { default as ActionService, IAddParams } from './fixtures/ActionService';

describe('actions', () => {
  let broker: Broker;

  beforeEach(async () => {
    broker = new Broker();
    broker.registerService(ActionService);
    await broker.start();
  });

  afterEach(async () => {
    await broker.stop();
  });

  it('should respond to call on vanilla action', async () => {
    const actual = await broker.call('actionService.foo');

    const expected = 'foo';
    expect(actual).toBe(expected);
  });

  it('should respond to call on action with custom name', async () => {
    const actual = await broker.call('actionService.wut');

    const expected = 'bar';
    expect(actual).toBe(expected);
  });

  it('should be able to use params', async () => {
    const actual = await broker.call<IAddParams, number>('actionService.add', { a: 1, b: 2 });

    const expected = 3;
    expect(actual).toBe(expected);
  });
});
