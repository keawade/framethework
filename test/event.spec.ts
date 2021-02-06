import { Broker, IEvent } from '../src';
import { default as EventService } from './fixtures/EventService';
import { default as validator } from 'validator';
import { differenceInMilliseconds, parseISO } from 'date-fns';
import { loiter } from './testUtils/loiter';
import { default as cuid } from 'cuid';

describe('events', () => {
  let broker: Broker;

  beforeEach(async () => {
    broker = new Broker();
    broker.registerService(EventService);
    await broker.start();
  });

  afterEach(async () => {
    await broker.stop();
  });

  it('should trigger handler in response to events', async () => {
    broker.emit('foo.bar.baz');
    broker.emit('foo.bar.baz');
    broker.emit('foo.bar.baz');

    // Wait just a smidge in case events take a moment to be handled
    await loiter(250);

    const actual: IEvent[] = await broker.call('eventService.getEvents');

    expect(actual).toHaveLength(3);
  });

  it('should have a null payload if no payload was sent', async () => {
    broker.emit('foo.bar.baz');

    // Wait just a smidge in case events take a moment to be handled
    await loiter(250);

    const expected: IEvent = {
      id: expect.any(String),
      timestamp: expect.any(String),
      name: 'foo.bar.baz',
      data: null,
    };
    const actual: IEvent[] = await broker.call('eventService.getEvents');

    expect(actual).toHaveLength(1);
    expect(actual[0]).toStrictEqual(expected);
    const difference = differenceInMilliseconds(new Date(), parseISO(actual[0].timestamp));
    expect(difference).toBeGreaterThanOrEqual(0);
    expect(difference).toBeLessThanOrEqual(1_500);
    expect(cuid.isCuid(actual[0].id)).toBe(true);
    expect(validator.isISO8601(actual[0].timestamp, { strict: true })).toBe(true);
  });

  it('should deliver payloads', async () => {
    broker.emit('foo.bar.baz', { some: 'payload' });

    // Wait just a smidge in case events take a moment to be handled
    await loiter(250);

    const expected: IEvent = {
      id: expect.any(String),
      timestamp: expect.any(String),
      name: 'foo.bar.baz',
      data: { some: 'payload' },
    };
    const actual: IEvent[] = await broker.call('eventService.getEvents');

    expect(actual).toHaveLength(1);
    expect(actual[0]).toStrictEqual(expected);
    const difference = differenceInMilliseconds(new Date(), parseISO(actual[0].timestamp));
    expect(difference).toBeGreaterThanOrEqual(0);
    expect(difference).toBeLessThanOrEqual(1_500);
    expect(cuid.isCuid(actual[0].id)).toBe(true);
    expect(validator.isISO8601(actual[0].timestamp, { strict: true })).toBe(true);
  });
});
