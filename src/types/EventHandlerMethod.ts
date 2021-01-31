import { IEvent } from './IEvent';

export type EventHandlerMethod<Payload = unknown> = (event: IEvent<Payload>) => Promise<unknown>;
