import 'reflect-metadata';

export const EVENT_SYMBOL = Symbol('FRAMETHEWORK_EVENT');

export function event(properties?: { name?: string }) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const eventName = properties?.name ?? propertyKey;

    const keyMetadata = Reflect.getMetadata(propertyKey, target);

    const newMetadata = {
      ...keyMetadata,
      [EVENT_SYMBOL]: {
        name: eventName,
      },
    };

    Reflect.defineMetadata(propertyKey, newMetadata, target);

    return descriptor;
  };
}
