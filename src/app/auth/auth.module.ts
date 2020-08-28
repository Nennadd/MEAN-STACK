import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, FormsModule, MaterialModule, AuthRoutingModule],
})
export class AuthModule {}