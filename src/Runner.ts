import { default as yargs } from 'yargs';
import { Broker } from './Broker';
import { default as path } from 'path';
import { sync as globby } from 'globby';
import { ServiceClass } from './types/ServiceClass';

export class Runner {
  public broker: Broker;

  constructor() {
    this.broker = new Broker();
  }

  public start(argv: string[]): Promise<void> {
    const args = yargs(argv.slice(2)).parse();

    const resolvedClasses = this.resolveClassesFromPaths(args._.map((svcPath) => `${svcPath}`));

    if (resolvedClasses.length < 1) {
      this.broker.logger.error('Service reference(s) required!');
      throw new Error('Service reference(s) required!');
    }

    for (const resolved of resolvedClasses) {
      if (!resolved.serviceClass) {
        this.broker.logger.error(
          `Failed to load service from default export of '${resolved.resolvedPath}'!`,
        );
        throw new Error(
          `Failed to load service from default export of '${resolved.resolvedPath}'!`,
        );
      }

      this.broker.registerService(resolved.serviceClass);
    }

    return this.broker.start();
  }

  public async stop(): Promise<void> {
    return this.broker.stop();
  }

  private resolveClassesFromPaths = (
    args: string[],
  ): Array<{
    resolvedPath: string;
    serviceClass: ServiceClass | undefined;
  }> =>
    args
      .reduce((acc: string[], val: string) => [...acc, ...globby(val)], [])
      .map((svcPath) => path.resolve(svcPath))
      .map((resolvedPath) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const serviceClass: ServiceClass | undefined = require(resolvedPath).default;

          return { serviceClass, resolvedPath };
        } catch (err) {
          throw new Error(`Failed to load module from '${resolvedPath}'!`);
        }
      });
}
