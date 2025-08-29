import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../auth.types';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  LoginForm!: FormGroup;
  form?: FormGroup | undefined;
  loginForm!: FormGroup;
  isLoggingIn = false;
  loginError = '';
  showPassword: boolean = false;
  requiredpass = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      document_id: ['', [Validators.required, Validators.pattern('^[0-9]{6,15}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

  }
  togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
  }
  onPasswordInput(): void {
    const password = this.loginForm.get('password')?.value || '';
    this.requiredpass = {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  }
  submit() {
    
    if (this.form?.valid ) {
      const login: Login = this.form?.value;
      
      this.loginError = '';
      this.isLoggingIn = true;
      
        error: (error: { status: number; }) => {
          this.isLoggingIn = false;
          if (error.status === 401) {
            this.loginError = 'Documento o contraseña incorrectos.';
          } else {
            this.loginError = 'Error del servidor. Por favor, inténtelo de nuevo más tarde.';
          }
          }  
      }
    }
    get isFormReady(): boolean {
  return this.loginForm.valid && Object.values(this.loginForm.controls).every(c => c.touched);
}
    onlyLetters(event: KeyboardEvent): void {
      const pattern = /[a-zA-Z\s]/;
      const inputChar = String.fromCharCode(event.charCode);
  
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

    
  
    onDocumentInputRegister(event: any) {
      const value = event.target.value.replace(/[^0-9]/g, '');
      this.loginForm.get('document_id')?.setValue(value, { emitEvent: false });
    }
  
  }
