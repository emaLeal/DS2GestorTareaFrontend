import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;


  requiredpass = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };

  documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
  ];

  departaments=[
    {value: 'Tecnología', label: 'Tecnología'},
    {value: 'Recursos Humanos', label: 'Recursos Humanos'},
    {value: 'Marketing', label: 'Marketing'},
    {value: 'Finanzas', label: 'Finanzas'}, 
    {value: 'Recursos Humanos' , label : 'Recursos Humanos'}
    
  ]

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      identification_type: ['', Validators.required],
      departaments: ['', Validators.required],
      document_id: ['', [Validators.required, Validators.pattern('^[0-9]{6,15}$')]],
      password: ['', [Validators.required, this.validatePassword()]],

    });
  }

  onPasswordInput(): void {
    const password = this.registerForm.get('password')?.value || '';
    this.requiredpass = {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  }
  

  togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
  }


  validatePassword() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const requiredpass = {
        length: value.length >= 8,
        hasUpper: /[A-Z]/.test(value),
        hasLower: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      };
      const isValid = requiredpass.length && requiredpass.hasUpper && requiredpass.hasLower && requiredpass.hasNumber && requiredpass.hasSpecial;
      return !isValid ? { requisitosNoCumplidos: true } : null;
    };
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
    this.registerForm.get('document_id')?.setValue(value, { emitEvent: false });
  }

  get isFormReady(): boolean {
  return this.registerForm.valid && Object.values(this.registerForm.controls).every(c => c.touched);
}


  submit(): void {
    if (this.registerForm.valid) {
      console.log(' Datos enviados:', this.registerForm.value);
      // Aquí iría AuthService
    } else {
      console.log('Formulario inválido');
    }
  }
}
