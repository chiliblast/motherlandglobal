import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private apiService: ApiService,
    public MS: MessageService,
    private toastr: ToastrService
  ) {}

  addRemoveFavourite() {
    if (this.MS.user == null) {
      this.toastr.error('Please signin');
    } else {
      var formData: any = new FormData();
      formData.append('user_id', this.MS.user.id);
      formData.append('video_id', this.MS.videos[0].id);

      this.apiService
        .addRemoveFavourite(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          if (res.status == 'success') {
            this.getFavourites(this.MS.user.id);
            this.toastr.success(res.message);
          } else if (res.status == 'fail') {
            this.toastr.error(res.message);
          }
        });
    }
  }

  getFavourites(user_id: number) {
    this.apiService
      .getFavourites(user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.MS.favourites = res;
      });
  }

  isFavourite(): boolean {
    if (this.MS.videos) {
      const video_id: number = this.MS.videos[0].id;
      const favourite = this.MS.favourites.find(
        (f: any) => f.video_id === video_id
      );
      return !!favourite;
    } else {
      return false;
    }
  }
}
