import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService) {}

  api_clickhandler() {
    this.apiService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
