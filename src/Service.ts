import { MsgCallback, Subscription } from 'ts-nats';
import { Broker } from './Broker';
import { ACTION_SYMBOL, IActionMetadata } from './decorators/action';
import { EVENT_SYMBOL, IEventMetadata } from './decorators/event';
import { ActionHandlerMethod, EventHandlerMethod } from './types';

export abstract class Service {
  protected logger;
  public abstract name: string;

  constructor(public broker: Broker) {
    this.logger = this.broker.logger;
  }

  public async registerServiceEndpoints(): Promise<void> {
    const metadataByKey = Reflect.getMetadataKeys(this).map((key: string) => ({
      key,
      metadata: Reflect.getMetadata(key, this),
    }));

    const actionSubscriptions = metadataByKey
      .filter(({ metadata }) => metadata[ACTION_SYMBOL])
      .map(({ key, metadata }) => this.registerEndpoint(key, metadata[ACTION_SYMBOL]));
    const eventSubscriptions = metadataByKey
      .filter(({ metadata }) => metadata[EVENT_SYMBOL])
      .map(({ key, metadata }) => this.registerEndpoint(key, metadata[EVENT_SYMBOL]));

    await Promise.all([...actionSubscriptions, ...eventSubscriptions]);
  }

  private registerEndpoint(
    key: string,
    metadata: IActionMetadata | IEventMetadata,
  ): Promise<Subscription> {
    this.logger.info({
      message: `[service] registering ${metadata.endpointType}`,
      metadata,
    });

    switch (metadata.endpointType) {
      case 'action':
        return this.broker.connection.subscribe(
          `action.${this.name}.${metadata.name}`,
          this.createActionHandler(
            metadata,
            ((this[key as keyof this] as unknown) as ActionHandlerMethod).bind(this),
          ),
          { queue: this.name },
        );
      case 'event':
        return this.broker.connection.subscribe(
          `event.${metadata.name}`,
          this.createEventHandler(
            metadata,
            ((this[key as keyof this] as unknown) as EventHandlerMethod).bind(this),
          ),
          { queue: metadata.grouped ? this.name : undefined },
        );
    }
  }

  private createActionHandler(
    actionMetadata: IActionMetadata,
    boundActionHandlerMethod: ActionHandlerMethod,
  ): MsgCallback {
    return (err, msg) => {
      if (err) {
        throw err;
      }

      // TODO: Input schemas and validation

      const response = boundActionHandlerMethod(msg.data);

      if (msg.reply) {
        this.broker.connection.publish(msg.reply, response);
      }
    };
  }

  private createEventHandler(
    eventMetadata: IEventMetadata,
    boundEventHandlerMethod: EventHandlerMethod,
  ): MsgCallback {
    return (err, msg) => {
      if (err) {
        throw err;
      }

      boundEventHandlerMethod({
        ...msg.data,
        name: eventMetadata.name,
      });
    };
  }
}
