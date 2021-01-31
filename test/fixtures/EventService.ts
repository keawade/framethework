import { action, Broker, event, IEvent, Service } from '../../src';

export class EventService extends Service {
  public name = 'eventService';

  private events: unknown[] = [];

  constructor(broker: Broker) {
    super(broker);
  }

  @action()
  public getEvents() {
    return this.events;
  }

  @event({ name: 'foo.bar.baz' })
  public handleEvent(event: IEvent<unknown>) {
    this.events.push(event);
  }
}
