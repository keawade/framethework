import * as NATS from 'ts-nats';
import { default as winston } from 'winston';
import { ServiceClass } from './types/ServiceClass';
import { default as cuid } from 'cuid';
import { formatISO } from 'date-fns';
import { IEvent } from './types';

export class Broker {
  public logger;
  public connection!: NATS.Client;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }

  public async start(services: ServiceClass[] = []): Promise<void> {
    this.connection = await NATS.connect({ payload: NATS.Payload.JSON });

    this.logger.info({ message: '[broker] connected' });

    for (const service of services) {
      await this.registerService(service);
    }
  }

  public async stop(): Promise<void> {
    await this.connection.drain();

    this.logger.info({ message: '[broker] disconnected' });
  }

  public async registerService(serviceClass: ServiceClass): Promise<void> {
    let serviceInstance;
    try {
      serviceInstance = new serviceClass(this);
    } catch (err) {
      this.logger.error(`Failed to create service instance from '${serviceClass.name}' class!`);
      throw err;
    }
    this.logger.info({ message: `[broker] registering service`, name: serviceInstance.name });
    await serviceInstance.registerServiceEndpoints();
  }

  public async call<Params, Response = unknown>(
    serviceAction: string,
    params?: Params,
  ): Promise<Response> {
    const response = await this.connection.request(`action.${serviceAction}`, 5_000, params);
    return response.data;
  }

  public emit<Payload>(eventName: string, payload?: Payload): void {
    const event: IEvent = {
      id: cuid(),
      name: eventName,
      timestamp: formatISO(new Date()),
      data: payload ?? null,
    };
    return this.connection.publish(`event.${eventName}`, event);
  }
}
