export interface IEvent<Payload = unknown> {
  /**
   * cuid
   *
   * @see http://usecuid.org/
   */
  readonly id: string;
  readonly name: string;
  /** ISO8601 date-time */
  readonly timestamp: string;
  readonly data: Payload;
}
