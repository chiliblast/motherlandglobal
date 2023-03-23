import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { ApiService } from './api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare var Cesium: any;
@Injectable({
  providedIn: 'root',
})
export class FunctionService {
  destroy$: Subject<boolean> = new Subject<boolean>();
  cameraAlt: number = 100000;
  constructor(
    private MS: MessageService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  gotoSelectedLocation() {
    var lng = this.MS.selectedLocation.longitude;
    var lat = this.MS.selectedLocation.latitude;

    this.MS.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, this.cameraAlt),
      complete: function () {
        //scope.selectLocation();
      },
    });

    let center = Cesium.Cartesian3.fromDegrees(lng, lat, 100);
    let circle = this.MS.viewer.entities.getById('Circle');
    if (circle == undefined) {
      this.MS.viewer.entities.add({
        id: 'Circle',
        position: center,
        billboard: {
          image: 'assets/circle.png',
          pixelSize: 1,
        },
      });
    } else {
      circle.position = center;
    }
  }

  getVideos(location_id: any) {
    this.apiService
      .getVideos(location_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.MS.videos = res;
        this.MS.videos[0].link = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.MS.videos[0].link
        );
      });
  }
}
