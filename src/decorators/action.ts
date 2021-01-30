import 'reflect-metadata';

export const ACTION_SYMBOL = Symbol('FRAMETHEWORK_ACTION');

export function action(properties?: { name?: string }) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const actionName = properties?.name ?? propertyKey;

    const keyMetadata = Reflect.getMetadata(propertyKey, target);

    const newMetadata = {
      ...keyMetadata,
      [ACTION_SYMBOL]: {
        name: actionName,
      },
    };

    Reflect.defineMetadata(propertyKey, newMetadata, target);

    return descriptor;
  };
}
