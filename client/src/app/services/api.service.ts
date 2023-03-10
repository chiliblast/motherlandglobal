import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  rootURL = '/api';

  getUsers() {
    return this.http.get(this.rootURL + '/getUsers');
  }

  getLocations() {
    return this.http.get(this.rootURL + '/getLocations');
  }

  getVideos(location_id: any) {
    return this.http.post(this.rootURL + '/getVideos', { location_id });
  }

  getFavourites(user_id: any) {
    return this.http.post(this.rootURL + '/getFavourites', { user_id });
  }

  addUser(user: any) {
    return this.http.post(this.rootURL + '/getUser', { user });
  }

  signin(formData: any) {
    return this.http.post(this.rootURL + '/signin', formData);
  }

  signup(formData: any) {
    /*for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }*/
    return this.http.post(this.rootURL + '/signup', formData);
  }

  addRemoveFavourite(formData: any) {
    return this.http.post(this.rootURL + '/addRemoveFavourite', formData);
  }
}
