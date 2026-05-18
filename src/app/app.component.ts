import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  template: '<ion-app><ion-router-outlet></ion-router-outlet></ion-app>',
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    // Aquí se inicializarán plugins de Capacitor (SplashScreen, StatusBar…)
  }
}
