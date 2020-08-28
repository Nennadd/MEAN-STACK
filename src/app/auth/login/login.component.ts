import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  // selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  isLoading = false;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm): void {
    if (form.valid) {
      this.authService.loginUser(form.value.email, form.value.password);
    }
    this.isLoading = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
