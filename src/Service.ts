import { Broker } from './Broker';

export abstract class Service {
  protected logger;
  public abstract name: string;

  constructor(public broker: Broker) {
    this.logger = broker.logger;
  }

  public register() {}
}
