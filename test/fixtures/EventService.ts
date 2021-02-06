import { action, event, IEvent, Service } from '../../src';

export default class EventService extends Service {
  public name = 'eventService';

  private events: unknown[] = [];

  @action()
  public getEvents(): unknown[] {
    return this.events;
  }

  @event({ name: 'foo.bar.baz' })
  public handleEvent(event: IEvent<unknown>): void {
    this.events.push(event);
  }
}
