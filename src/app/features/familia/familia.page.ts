import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-familia',
  standalone: false,
  templateUrl: './familia.page.html',
})
export class FamiliaPage implements OnInit {

  cargando = true;

  ngOnInit(): void {
    // TODO: inicializar módulo Familia
    this.cargando = false;
  }
}
