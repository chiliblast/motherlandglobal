import { SafeResourceUrl } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private subject = new Subject<string>();

  panel = 'video';

  viewer: any; //cesium viewer

  locations: any; //{id,city_name,country_name,distance,latitude,longitude,position}
  videos: any; //{id,link,location_id}
  //selectedLocation: any;
  userLocation: any = { lat: 0, lng: 0 };
  selectedLocation: any = {
    id: null,
    city_name: null,
    country_name: null,
    distance: null,
    latitude: null,
    longitude: null,
    position: null,
  };

  sendMessage(message: string) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
