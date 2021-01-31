export interface IEvent<Payload = unknown> {
  /** uuid v4 */
  readonly id: string;
  readonly name: string;
  /** ISO8601 date-time */
  readonly timestamp: string;
  readonly data: Payload;
}
