import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  signinForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private MS: MessageService,
    private toastr: ToastrService
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register_clickhandler() {
    this.MS.panel = 'signup';
  }

  onSubmit() {
    var formData: any = new FormData();
    formData.append('email', this.signinForm.get('email')!.value);
    formData.append('password', this.signinForm.get('password')!.value);

    this.apiService
      .signin(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.MS.user = res.body;
          this.toastr.success(res.message);
          this.MS.panel = 'video';
        } else if (res.status == 'fail') {
          this.MS.user = null;
          this.toastr.error(res.message);
        }
      });
  }
}
