import * as NATS from 'ts-nats';
import { default as winston } from 'winston';
import { ServiceClass } from './types/ServiceClass';
import { default as cuid } from 'cuid';
import { formatISO } from 'date-fns';
import { IEvent } from './types';
import { Service } from './Service';

interface IBrokerStartOptions {
  server: string;
  port: number;
}

export class Broker {
  public logger;
  public connection!: NATS.Client;
  private services: Service[] = [];

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }

  public async start(options?: Partial<IBrokerStartOptions>): Promise<void> {
    const server = options?.server || process.env.NATS_SERVER || 'nats://localhost:4222';

    this.logger.info({ message: `[broker] opening connection to NATS`, meta: { server } });

    this.connection = await NATS.connect({
      payload: NATS.Payload.JSON,
      servers: [server],
      url: server,
    });

    this.logger.info({ message: '[broker] connected' });

    this.logger.info({ message: '[broker] starting services...' });
    for (const serviceInstance of this.services) {
      await serviceInstance.registerServiceEndpoints();
    }
    this.logger.info({ message: '[broker] services started!' });
  }

  public async stop(): Promise<void> {
    await this.connection.drain();

    this.logger.info({ message: '[broker] disconnected' });
  }

  public registerService(serviceClass: ServiceClass): void {
    let serviceInstance;
    try {
      serviceInstance = new serviceClass(this);
    } catch (err) {
      this.logger.error(`Failed to create service instance from '${serviceClass.name}' class!`);
      throw err;
    }
    this.logger.info({ message: `[broker] registering service`, name: serviceInstance.name });
    this.services.push(serviceInstance);
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
