import { IContext } from './IContext';
import { IEvent } from './IEvent';

export interface IEventContext<Payload = unknown> extends IContext {
  event: IEvent<Payload>;
}
