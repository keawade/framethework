import { Broker } from '../Broker';
import { Service } from '../Service';

export type ServiceClass = {
  new (broker: Broker): Service;
};
