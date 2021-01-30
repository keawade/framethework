import { Broker } from '../src/Broker';
import { Service } from '../src/Service';

const loiter = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Test suite currently only being used as debugging tool
describe('things', () => {
  it('should pass', async () => {
    class CoolService extends Service {
      public name = 'coolService';

      constructor(broker: Broker) {
        super(broker);

        this.test('yupyup?');
      }

      public test(message: string) {
        this.broker.connection.publish('nats-test-subject', message);
      }
    }

    const broker = new Broker();
    await broker.start([CoolService]);

    await loiter(2000);

    await broker.stop();
  });
});
