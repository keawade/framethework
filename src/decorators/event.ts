import 'reflect-metadata';

export const EVENT_SYMBOL = Symbol('FRAMETHEWORK_EVENT');

export interface IEventMetadata {
  endpointType: 'event';
  name: string;
  grouped: boolean;
}

export interface IEventDecoratorParams {
  name: string;
  /**
   * Grouped events are load balanced across service instances.
   *
   * @see https://docs.nats.io/nats-concepts/queue
   * @default true
   */
  grouped?: boolean;
}

export function event(properties: IEventDecoratorParams) {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const keyMetadata = Reflect.getMetadata(propertyKey, target);

    const newMetadata = {
      ...keyMetadata,
      [EVENT_SYMBOL]: {
        endpointType: 'event',
        grouped: true,
        ...properties,
      },
    };

    Reflect.defineMetadata(propertyKey, newMetadata, target);

    return descriptor;
  };
}
