import { Runner } from '../src/Runner';

describe('runner', () => {
  let runner: Runner;

  beforeEach(() => {
    runner = new Runner();
  });

  afterEach(async () => {
    await runner.stop();
  });

  const getServiceNames = () => runner.broker.services.map((svc) => svc.name);

  it('should find specified service', async () => {
    await runner.start(['node', 'runner.ts', 'test/fixtures/runner/ActionService.ts']);

    expect(getServiceNames()).toEqual(['actionService']);
  });

  it('should find multiple specified services', async () => {
    await runner.start([
      'node',
      'runner.ts',
      'test/fixtures/runner/ActionService.ts',
      'test/fixtures/runner/EventService.ts',
    ]);

    expect(getServiceNames()).toEqual(['actionService', 'eventService']);
  });

  it('should find specified services with glob pattern', async () => {
    await runner.start(['node', 'runner.ts', 'test/fixtures/runner/*Service.ts']);

    expect(getServiceNames()).toEqual(['actionService', 'eventService']);
  });

  it('should exit with error if no services are found', async () => {
    try {
      await runner.start([]);
      fail('should have thrown an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toBe(`Service reference(s) required!`);
    }
  });

  it('should exit with error if no service classes were resolved', async () => {
    try {
      await runner.start(['node', 'runner.ts', 'test/fixtures/runner/nope.ts']);
      fail('should have thrown an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toBe(`Service reference(s) required!`);
    }
  });

  it('should exit with error if default export cannot be resolved', async () => {
    try {
      await runner.start(['node', 'runner.ts', 'test/fixtures/runner/NoDefaultExport.ts']);
      fail('should have thrown an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toMatch(
        /Failed to load service from default export of '.*\/test\/fixtures\/runner\/NoDefaultExport\.ts'!/,
      );
    }
  });
});
