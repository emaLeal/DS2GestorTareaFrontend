import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, tap } from 'rxjs';


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


  requisitos = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }
  ngOnInit(): void {
    // Formulario de email
    const token = this._route.snapshot.paramMap.get('token');

    // Formulario de nueva contraseña
    this.formPassword = this._fb.group({
      password: ['', [Validators.required, this.validatePassword()]],
      confirmPassword: ['', [Validators.required]],
      token: [token]

    }, { validators: this.passwordsMatchValidator });
  }

  // Guardar nueva contraseña
  submitPassword(): void {
    if (this.formPassword.valid) {
      const payload = this.formPassword.value;

      this._authService.confirmResetPassword(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.status === 'OK') {
            alert('Cambiaste exitosamente la contraseña')
            this._router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Validar que ambas contraseñas coincidan
  passwordsMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirm = formGroup.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  // Validar requisitos de contraseña
  validatePassword() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';

      this.requisitos = {
        length: value.length >= 8,
        hasUpper: /[A-Z]/.test(value),
        hasLower: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };

      const isValid = Object.values(this.requisitos).every(v => v);
      return isValid ? null : { requisitosNoCumplidos: true };
    };
  }

}

