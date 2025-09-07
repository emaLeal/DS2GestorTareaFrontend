import { Component,OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {


  formEmail!: FormGroup;
  formPassword!: FormGroup;
  showPassword = false;


  

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Formulario de email
    this.formEmail = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

  }

  // Enviar correo para reset
  submitEmail(): void {
    if (this.formEmail.valid) {
      const email = this.formEmail.value.email;
      console.log('📩 Enviando email al backend:', email);

     this._authService.resetPassword(email).subscribe(res => {
      console.log(res)
     })
    }
  }

  
}

