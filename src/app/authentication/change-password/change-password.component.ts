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


  formEmail!: FormGroup;
  formPassword!: FormGroup;
  showPassword = false;


  

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

  
}

