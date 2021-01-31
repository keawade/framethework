export interface IEvent<Payload = unknown> {
  readonly id: string;
  readonly name: string;
  readonly timestamp: string;
  readonly data: Payload;
}
