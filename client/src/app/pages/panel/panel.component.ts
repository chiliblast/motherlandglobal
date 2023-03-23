import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FunctionService } from 'src/app/services/function.service';

import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  locationCtrl = new FormControl('');
  filteredOptions: Observable<any>;

  constructor(public MS: MessageService, private FS: FunctionService) {}

  ngOnInit() {
    this.filteredOptions = this.locationCtrl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const location = typeof value === 'string' ? value : value?.city_name;
        return location ? this._filter(location as string) : this.MS.locations;
      })
    );
  }

  private _filter(location: string): any {
    const filterValue = location.toLowerCase();

    return this.MS.locations.filter((location: any) =>
      location.city_name.toLowerCase().includes(filterValue)
    );
  }
  /*
  public displayLocationFn(location: any): string {
    return location ? location.city_name : '';
  }*/

  signout_clickHandler() {
    this.MS.user = null;
    this.MS.videos = null;
  }

  onSubmit() {
    let city_name = this.locationCtrl.value;
    let location = this.MS.locations.find(
      (location: any) => location.city_name === city_name
    );
    if (location) {
      this.MS.selectedLocation = location;
      this.FS.getVideos(this.MS.selectedLocation.id);
      this.FS.gotoSelectedLocation();
    }
  }
}
