# Diseno De Migracion Directa A Angular 21

## Contexto

Proyecto actual:

- Angular 17.3.x con `NgModule`
- Ionic Angular 8.x
- Capacitor 6.x
- Configuracion clasica con `angular.json`, `karma`, `zone.js` y lazy loading por modulos

El objetivo es realizar una migracion directa desde Angular 17 a Angular 21, manteniendo operativa la aplicacion y sin introducir una migracion arquitectonica paralela a standalone, zoneless o signal forms.

## Objetivo

Actualizar el proyecto a Angular 21 y dejar funcionando en la misma migracion:

- `npm install`
- `npm run start`
- `npm run build`
- `npm run test`
- `npx cap sync`

Tambien se incluyen las adaptaciones de codigo y configuracion necesarias para resolver incompatibilidades derivadas del salto de version.

## Fuera De Alcance

Quedan explicitamente fuera de alcance en esta migracion:

- Reescritura a standalone APIs
- Adopcion de zoneless change detection
- Migracion a signal forms
- Refactors de arquitectura no necesarios para compatibilidad
- Rediseño visual o cambios funcionales de producto

## Enfoque Elegido

Se adopta una migracion directa controlada en cuatro bloques:

1. Toolchain Angular
2. Integracion Ionic
3. Integracion Capacitor
4. Ajustes de codigo y configuracion

La razon para este enfoque es reducir el riesgo de mezclar problemas de `peerDependencies`, builders, testing e integraciones moviles en una sola tanda de cambios no aislables.

## Bloque 1: Toolchain Angular

Se actualizan primero las dependencias base necesarias para Angular 21:

- `@angular/*`
- `@angular/cli`
- `@angular-devkit/build-angular`
- `@angular/compiler-cli`
- `typescript`
- `rxjs` si la ventana de compatibilidad final lo exige
- `zone.js` si la configuracion final de la app lo sigue utilizando

Resultados esperados del bloque:

- Dependencias alineadas con Angular 21
- `package-lock.json` regenerado sin conflictos bloqueantes
- Configuracion base del workspace aceptada por la version nueva del CLI

## Bloque 2: Integracion Ionic

Se valida y actualiza la capa `@ionic/angular` y, si aplica, `@ionic/angular-toolkit` para que no queden peer dependencies o builders obsoletos.

Principios:

- Mantener el uso actual basado en modulos
- Evitar cambios a APIs standalone de Ionic salvo necesidad tecnica real
- Tratar como riesgo controlado el hecho de que Angular 21 puede funcionar con Ionic antes de que toda la documentacion oficial vaya al mismo ritmo

Resultados esperados del bloque:

- La app compila con componentes Ionic
- No quedan incompatibilidades bloqueantes en toolkit o builders relacionados

## Bloque 3: Integracion Capacitor

Se revisan y actualizan los paquetes de `@capacitor/*` y el CLI asociado para mantener compatibilidad con el stack actualizado.

Actividades incluidas:

- Alinear `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios` y plugins usados
- Validar `npx cap sync`
- Corregir cualquier cambio de configuracion que afecte a la generacion de `www`

Resultados esperados del bloque:

- `cap sync` funcional
- Artefactos web generados en la ruta esperada por Capacitor

## Bloque 4: Codigo Y Configuracion

Se corrigen incompatibilidades provocadas por cambios de Angular, TypeScript y tooling.

Esto puede incluir:

- Ajustes en `angular.json`
- Ajustes en `tsconfig.json`, `tsconfig.app.json` y `tsconfig.spec.json`
- Cambios en `karma.conf.js` o en la infraestructura de tests si Angular 21 fuerza actualizaciones
- Correcciones de tipos o APIs en guards, interceptors, services, pages y modulos
- Eliminacion de configuraciones de workspace obsoletas o warnings convertidos en errores

Principio rector:

Solo se cambia codigo cuando sea necesario para que el proyecto compile, arranque, haga build, pase tests y sincronice con Capacitor.

## Criterios De Terminado

La migracion se considera terminada cuando se cumplen todos estos puntos:

- `npm install` termina sin bloqueos de dependencias
- `npm run start` levanta la aplicacion
- `npm run build` genera artefactos de produccion
- `npm run test` funciona con la infraestructura soportada por el stack final
- `npx cap sync` termina correctamente
- No quedan errores de compilacion TypeScript ni de Angular templates

## Riesgos

### Riesgo 1: Compatibilidad Node/TypeScript

Angular 21 requiere una base de `Node.js` y `TypeScript` mas nueva que Angular 17. Si el entorno local no esta dentro del rango soportado, el upgrade fallara antes incluso de compilar.

Mitigacion:

- Verificar version de Node antes de instalar
- Subir `TypeScript` dentro del rango exigido por Angular 21

### Riesgo 2: Soporte Ionic no plenamente oficial

Existe evidencia de funcionamiento practico con Angular 21, pero la cadencia de soporte oficial de Ionic puede ir por detras del release de Angular.

Mitigacion:

- Priorizar versiones de Ionic mas recientes
- Validar con pruebas reales de `serve`, `build` y `test`
- Documentar cualquier compatibilidad funcional no oficialmente declarada

### Riesgo 3: Tooling heredado de tests

Los tests son un punto sensible en upgrades mayores por cambios en builders, polyfills, Karma o helpers de testing.

Mitigacion:

- Corregir primero la compilacion general
- Ajustar despues la infraestructura de test con cambios minimos
- Mantener el runner actual salvo que el stack final obligue a cambiarlo

### Riesgo 4: Configuracion obsoleta del workspace

Configuraciones validas en Angular 17 pueden generar warnings o errores en Angular 21.

Mitigacion:

- Revisar `angular.json` y `tsconfig*`
- Eliminar o actualizar claves obsoletas solo cuando la nueva version lo exija

## Estrategia De Validacion

La validacion se ejecuta en este orden:

1. `npm install`
2. `npm run build`
3. `npm run start`
4. `npm run test`
5. `npx cap sync`

Razon del orden:

- `build` da una señal rapida de compatibilidad estructural
- `start` valida arranque y router en entorno dev
- `test` detecta roturas de tooling y tipado
- `cap sync` se deja al final porque depende de que los artefactos web ya se generen correctamente

## Decisiones Explicitas

- Se mantiene arquitectura con `NgModule`
- No se moderniza a standalone en esta fase
- No se adopta zoneless
- No se cambian formularios a signal forms
- No se realizan refactors ajenos a compatibilidad
- Se aceptan adaptaciones de codigo cuando sean necesarias para compatibilidad con Angular 21

## Resultado Esperado

Al finalizar, el proyecto debe quedar en Angular 21 con el stack principal alineado, conservando su arquitectura actual y con una base estable para una futura modernizacion incremental si se decide abordar standalone, testing moderno o mejoras de rendimiento en una fase posterior.

## Fuentes De Compatibilidad

- Angular version compatibility: https://next.angular.dev/reference/versions
- Seguimiento publico de compatibilidad Angular 21 en Ionic: https://github.com/ionic-team/ionic-framework/issues/30907
- Paquete actual de `@ionic/angular`: https://www.npmjs.com/package/@ionic/angular
