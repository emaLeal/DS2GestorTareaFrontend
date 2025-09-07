import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  formEmail!: FormGroup;
  formPassword!: FormGroup;
  showPassword = false;




  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
  ) { }

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
      this._authService.resetPassword(email).subscribe(res => {
        console.log(res)
        if (res.status === 'OK')
          alert(`Se ha enviado a tu correo electronico ${email} un enlace para poder cambiar tu contraseña, tienes 24 horas.`)
      })
    }
  }
}




