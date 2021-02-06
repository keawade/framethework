/* eslint-disable no-process-exit */
import { default as yargs } from 'yargs';
import { Broker } from './Broker';
import { default as path } from 'path';

export class Runner {
  private broker: Broker;

  constructor() {
    this.broker = new Broker();
  }

  public start(argv: string[]): Promise<void> {
    const args = yargs(argv.slice(2)).parse();

    if (args._.length < 1) {
      this.broker.logger.error('Service reference(s) required!');
      process.exit(1);
    }

    const serviceClasses = args._.map((svcPath) => `${svcPath}`)
      .map((svcPath) => path.resolve(svcPath))
      .map((resolvedPath) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const serviceClass = require(resolvedPath).default;

          if (serviceClass === undefined) {
            this.broker.logger.error(
              `Failed to load service from default export of '${resolvedPath}'!`,
            );
            process.exit(1);
          }

          return serviceClass;
        } catch (err) {
          this.broker.logger.error(`Failed to load module from '${resolvedPath}'!`);
          throw err;
        }
      });

    for (const serviceClass of serviceClasses) {
      this.broker.registerService(serviceClass);
    }

    return this.broker.start().catch((err) => {
      this.broker.logger.error('Failed to start services.');
      console.error(err);
      process.exit(1);
    });
  }
}
/* eslint-enable no-process-exit */
