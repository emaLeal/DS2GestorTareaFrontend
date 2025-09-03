import { Component,OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
 step: number = 2;// Paso actual (1 = correo, 2 = nueva contraseña)

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
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
  //pivate authService: AuthService, // cuando este el servicio
    private router: Router
  ) {}

  ngOnInit(): void {
    // Formulario de email
    this.formEmail = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulario de nueva contraseña
    this.formPassword = this.fb.group({
      password: ['', [Validators.required, this.validatePassword()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  // Enviar correo para reset
  submitEmail(): void {
    if (this.formEmail.valid) {
      const email = this.formEmail.value.email;
      console.log('📩 Enviando email al backend:', email);

      // Conectar con backend
      /*
      this.authService.requestResetPassword(email).subscribe({
        next: (res) => {
          console.log(res);
          this.step = 2; // avanzar a paso de contraseña
        },
        error: (err) => {
          console.error(err);
          this.loginError = 'Error al enviar el correo. Intenta de nuevo.';
        }
      });*/
    }
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

