import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Usuario } from '../../core/models/domain.models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.page.html',
})
export class PerfilPage implements OnInit {
  usuario: Usuario | null = null;
  cerrandoSesion = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuario;

    if (!this.usuario) {
      this.router.navigate(['/auth'], { replaceUrl: true });
    }
  }

  cerrarSesion(): void {
    if (this.cerrandoSesion) {
      return;
    }

    this.cerrandoSesion = true;

    this.authService.logout().pipe(
      finalize(() => {
        this.cerrandoSesion = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/auth'], { replaceUrl: true });
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/auth'], { replaceUrl: true });
      },
    });
  }
}
