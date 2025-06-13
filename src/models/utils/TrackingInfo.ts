export default class TrackingInfo {
  constructor(
    public readonly statusCode: number,
    public readonly isSucceded: boolean,
    public readonly message: string,
  ) {
    this.statusCode = statusCode;
    this.isSucceded = isSucceded;
    this.message = message;
  }
}
