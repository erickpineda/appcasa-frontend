import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.page.html',
})
export class CalendarioPage implements OnInit {

  cargando = true;

  ngOnInit(): void {
    // TODO: inicializar módulo Calendario
    this.cargando = false;
  }
}
