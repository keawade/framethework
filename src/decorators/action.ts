import 'reflect-metadata';

export const ACTION_SYMBOL = Symbol('FRAMETHEWORK_ACTION');

export interface IActionMetadata {
  name: string;
}

export interface IActionDecoratorParams {
  name?: string;
}

export function action(properties?: IActionDecoratorParams) {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const actionName = properties?.name ?? propertyKey;

    const keyMetadata = Reflect.getMetadata(propertyKey, target);

    const newMetadata: { [ACTION_SYMBOL]: IActionMetadata } = {
      ...keyMetadata,
      [ACTION_SYMBOL]: {
        name: actionName,
      },
    };

    Reflect.defineMetadata(propertyKey, newMetadata, target);

    return descriptor;
  };
}
