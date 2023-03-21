import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  locationCtrl = new FormControl('');
  filteredOptions: Observable<any>;
  constructor(public MS: MessageService) {}

  ngOnInit() {
    this.filteredOptions = this.locationCtrl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const location = typeof value === 'string' ? value : value?.city_name;
        return location ? this._filter(location as string) : this.MS.locations;
      })
    );
  }

  displayFn(location: any): string {
    return location && location.city_name ? location.country_name : '';
  }

  private _filter(location: string): any {
    const filterValue = location.toLowerCase();

    return this.MS.locations.filter((location: any) =>
      location.city_name.toLowerCase().includes(filterValue)
    );
  }

  signout_clickHandler() {
    this.MS.user = null;
    this.MS.videos = null;
  }
}
