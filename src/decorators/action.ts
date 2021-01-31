import 'reflect-metadata';

export const ACTION_SYMBOL = Symbol('FRAMETHEWORK_ACTION');

export interface IActionMetadata {
  name: string;
}

export interface IActionDecoratorParams {
  name?: string;
}

export function action(properties?: IActionDecoratorParams) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
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