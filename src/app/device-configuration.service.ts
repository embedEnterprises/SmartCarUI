import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
@Injectable({
  providedIn: 'root'
})
export class DeviceConfigurationService {

  deviceInfo;
  deviceType;
  orientation;

  constructor(private deviceService: DeviceDetectorService) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  getDeviceType(){
    return this.deviceInfo.deviceType;
  }
  getDeviceOrientation(){
    return this.deviceInfo.orientation;
  }


}
