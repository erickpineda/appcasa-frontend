import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculadoras',
  standalone: false,
  templateUrl: './calculadoras.page.html',
})
export class CalculadorasPage implements OnInit {

  cargando = true;

  ngOnInit(): void {
    // TODO: inicializar módulo Calculadoras
    this.cargando = false;
  }
}
