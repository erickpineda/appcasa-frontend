import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mascotas',
  standalone: false,
  templateUrl: './mascotas.page.html',
})
export class MascotasPage implements OnInit {

  cargando = true;

  ngOnInit(): void {
    // TODO: inicializar módulo Mascotas
    this.cargando = false;
  }
}
