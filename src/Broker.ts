import * as NATS from 'ts-nats';
import { Service } from './Service';
import { ServiceClass } from './types/ServiceClass';

export class Broker {
  public logger = console;
  public connection!: NATS.Client;

  public async start(services: ServiceClass[] = []) {
    this.connection = await NATS.connect();

    this.logger.info('[Broker] Connected');

    services.forEach((s) => this.registerService(s));
  }

  public async stop() {
    await this.connection.drain();

    this.logger.info('[Broker] Disconnected');
  }

  public registerService(serviceClass: ServiceClass) {
    const serviceInstance = new serviceClass(this);
    this.logger.log(`[Broker] Registering service '${serviceInstance.name}'`);
    serviceInstance.register();
  }
}
