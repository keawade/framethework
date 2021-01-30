import { MsgCallback } from 'ts-nats';
import winston, { createLogger, format, transports } from 'winston';
import { Broker } from './Broker';
import { ACTION_SYMBOL } from './decorators/action';

export type ActionMethod = (ctx: unknown) => Promise<any>;
export type ActionMetadata = { name: string };
export type Context<Params = unknown> = {
  actionName: string;
  params: Params;
  call: <P, R>(actionName: string, params: P) => Promise<R>;
  logger: winston.Logger;
};

export abstract class Service {
  protected logger;
  public abstract name: string;

  constructor(public broker: Broker) {
    this.logger = this.broker.logger;
  }

  public async register() {
    await this.registerActions();
  }

  private async registerActions() {
    const keys = Reflect.getMetadataKeys(this);
    const actions: [key: string, metadata: ActionMetadata][] = keys
      .map((key: string) => [key, Reflect.getMetadata(key, this)] as [string, any])
      .filter(([_, metadata]) => metadata[ACTION_SYMBOL])
      .map(([key, metadata]) => [key, metadata[ACTION_SYMBOL]]);

    for (let [key, metadata] of actions) {
      const actionSubject = `${this.name}.${metadata.name}`;
      this.logger.info({ message: `[service] registering action`, actionSubject, metadata });
      await this.broker.connection.subscribe(
        actionSubject,
        this.createActionHandler(metadata, (this as any)[key]),
      );
    }
  }

  private createActionHandler(actionMetadata: ActionMetadata, method: ActionMethod): MsgCallback {
    return (err, msg) => {
      if (err) {
        throw err;
      }

      const response = method({
        actionName: actionMetadata.name,
        params: msg.data,
        call: this.broker.call,
        logger: this.logger,
      });

      if (msg.reply) {
        this.broker.connection.publish(msg.reply, response);
      }
    };
  }
}
