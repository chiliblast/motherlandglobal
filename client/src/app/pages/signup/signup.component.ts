import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (
      this.signupForm.get('password')!.value ==
      this.signupForm.get('confirmPassword')!.value
    ) {
      var formData: any = new FormData();
      formData.append('firstName', this.signupForm.get('firstName')!.value);
      formData.append('lastName', this.signupForm.get('lastName')!.value);
      formData.append('email', this.signupForm.get('email')!.value);
      formData.append('password', this.signupForm.get('password')!.value);

      this.apiService
        .signup(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          console.log(res);
        });

      //this.signupForm.reset();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
