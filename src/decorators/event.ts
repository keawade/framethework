import 'reflect-metadata';

export const EVENT_SYMBOL = Symbol('FRAMETHEWORK_EVENT');

export interface IEventMetadata {
  name: string;
}

export interface IEventDecoratorParams {
  name: string;
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
        name: properties.name,
      },
    };

    Reflect.defineMetadata(propertyKey, newMetadata, target);

    return descriptor;
  };
}
