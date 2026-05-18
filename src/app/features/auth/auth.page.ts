import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.page.html',
})
export class AuthPage implements OnInit {

  segmento: 'login' | 'registro' = 'login';
  loginForm!: FormGroup;
  registroForm!: FormGroup;
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
      return;
    }
    this.initForms();
  }

  private initForms(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registroForm = this.fb.group({
      nombre:    ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.maxLength(150)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) { return; }

    const loading = await this.loadingCtrl.create({ message: 'Accediendo...' });
    await loading.present();

    this.authService.login(this.loginForm.value).subscribe({
      next: async () => {
        await loading.dismiss();
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.detail ?? 'Email o contraseña incorrectos';
        const toast = await this.toastCtrl.create({
          message: msg, duration: 3000, color: 'danger', position: 'top',
        });
        await toast.present();
      },
    });
  }

  async registro(): Promise<void> {
    if (this.registroForm.invalid) { return; }

    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();

    this.authService.registro(this.registroForm.value).subscribe({
      next: async () => {
        await loading.dismiss();
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.detail ?? 'Error al crear la cuenta';
        const toast = await this.toastCtrl.create({
          message: msg, duration: 3000, color: 'danger', position: 'top',
        });
        await toast.present();
      },
    });
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  campoInvalido(form: FormGroup, campo: string): boolean {
    const ctrl = form.get(campo);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
