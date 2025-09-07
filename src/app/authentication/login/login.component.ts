import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../auth.types';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

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

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
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
    if (this.loginForm?.valid) {
      const login: Login = this.loginForm?.value;
      
      this.loginError = '';
      this.isLoggingIn = true;
      this._authService.login(login).subscribe(res => {
        this._authService.getProfile()
        this._router.navigate(['/dashboard'])
      })

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
