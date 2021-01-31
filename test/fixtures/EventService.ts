import { action, Broker, IEventContext, event, Service, IActionContext } from '../../src';

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
  public handleEvent(ctx: IEventContext) {
    this.events.push(ctx.event);
  }
}
