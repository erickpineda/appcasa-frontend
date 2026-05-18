import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recordatorios',
  standalone: false,
  templateUrl: './recordatorios.page.html',
})
export class RecordatoriosPage implements OnInit {

  cargando = true;

  ngOnInit(): void {
    // TODO: inicializar módulo Recordatorios
    this.cargando = false;
  }
}
