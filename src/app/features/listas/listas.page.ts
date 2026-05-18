import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listas',
  standalone: false,
  templateUrl: './listas.page.html',
})
export class ListasPage implements OnInit {

  cargando = true;

  ngOnInit(): void {
    // TODO: inicializar módulo Listas
    this.cargando = false;
  }
}
