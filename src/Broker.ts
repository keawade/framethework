import * as NATS from 'ts-nats';
import { default as winston } from 'winston';
import { ServiceClass } from './types/ServiceClass';

export class Broker {
  public logger;
  public connection!: NATS.Client;

  constructor(options?: { logger?: boolean }) {
    const loggerEnabled = options?.logger ?? true;

    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
      silent: !loggerEnabled,
    });
  }

  public async start(services: ServiceClass[] = []) {
    this.connection = await NATS.connect({ payload: NATS.Payload.JSON });

    this.logger.info({ message: '[broker] connected' });

    for (let service of services) {
      await this.registerService(service);
    }
  }

  public async stop() {
    await this.connection.drain();

    this.logger.info({ message: '[broker] disconnected' });
  }

  public async registerService(serviceClass: ServiceClass) {
    const serviceInstance = new serviceClass(this);
    this.logger.info({ message: `[broker] registering service`, name: serviceInstance.name });
    await serviceInstance.register();
  }

  public async call<P, R = unknown>(serviceAction: string, params?: P) {
    const response = await this.connection.request(serviceAction, 5_000, params);
    return response.data;
  }
}
