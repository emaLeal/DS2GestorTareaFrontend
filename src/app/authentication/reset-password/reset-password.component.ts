import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

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


  requisitos = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };

   constructor(
    private fb: FormBuilder,
  //pivate authService: AuthService, // cuando este el servicio
    private router: Router
  ) {}
  ngOnInit(): void {
    // Formulario de email

    // Formulario de nueva contraseña
    this.formPassword = this.fb.group({
      password: ['', [Validators.required, this.validatePassword()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  // Guardar nueva contraseña
  submitPassword(): void {
    if (this.formPassword.valid) {
      const payload = this.formPassword.value;
      console.log('🔑 Enviando nueva contraseña al backend:', payload);

      // Conectar con backend cuando este (yo ni idea como pero creo q asi ajjaja )
      /*
      this.authService.confirmResetPassword(payload).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          this.loginError = 'Error al cambiar la contraseña.';
        }
      });*/
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




