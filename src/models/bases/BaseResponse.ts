import TrackingInfo from "../utils/TrackingInfo";

export default class BaseResponse<T> {
  public data?: T;
  public trackingInfo: TrackingInfo;

  constructor(succeded: boolean, message: string, status: number, data?: T) {
    if (data != null || data != undefined) {
      this.data = data;
    }

    this.trackingInfo = new TrackingInfo(status, succeded, message);
  }
}
