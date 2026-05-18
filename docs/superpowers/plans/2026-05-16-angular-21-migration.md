# Angular 21 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar `appcasa-frontend` de Angular 17 a Angular 21 y dejar operativos `start`, `build`, `test` y `cap sync` sin reescribir la arquitectura actual basada en `NgModule`.

**Architecture:** La implementacion mantiene el bootstrap y los modulos actuales, actualiza primero el toolchain Angular, luego las integraciones de Ionic y Capacitor, y por ultimo corrige incompatibilidades de configuracion, tests y tipos. La prioridad es compatibilidad funcional, no modernizacion a standalone ni zoneless.

**Tech Stack:** Angular 21, Angular CLI 21, TypeScript 5.9, RxJS 7, Zone.js 0.15, Ionic Angular 8, Ionic Angular Toolkit 12, Capacitor 8, Karma, Jasmine, SCSS.

---

## Planned File Map

- Modify: `c:\dev\git\appcasa-frontend\package.json`
  - Alinear versiones de Angular, Ionic, Capacitor y scripts de trabajo.
- Modify: `c:\dev\git\appcasa-frontend\package-lock.json`
  - Regenerar el lockfile tras la actualizacion de dependencias.
- Modify: `c:\dev\git\appcasa-frontend\angular.json`
  - Limpiar claves obsoletas del workspace y ajustar builders solo si Angular 21 lo requiere.
- Modify: `c:\dev\git\appcasa-frontend\tsconfig.json`
  - Alinear opciones del compilador con TypeScript 5.9 y Angular 21.
- Modify: `c:\dev\git\appcasa-frontend\tsconfig.app.json`
  - Ajustar entradas del build si las migraciones las cambian.
- Modify: `c:\dev\git\appcasa-frontend\tsconfig.spec.json`
  - Ajustar tipos y entradas de tests si Angular 21 los exige.
- Modify: `c:\dev\git\appcasa-frontend\karma.conf.js`
  - Mantener o corregir infraestructura de Karma/Jasmine tras el upgrade.
- Modify: `c:\dev\git\appcasa-frontend\capacitor.config.ts`
  - Validar que `webDir` y plugins sigan alineados con el build web.
- Modify: `c:\dev\git\appcasa-frontend\src\main.ts`
  - Mantener bootstrap actual si sigue siendo valido o adaptarlo si Angular CLI migra algo.
- Modify: `c:\dev\git\appcasa-frontend\src\test.ts`
  - Mantener la inicializacion de test bed compatible con Angular 21.
- Modify: `c:\dev\git\appcasa-frontend\src\app\core\models\domain.models.ts`
  - Resolver incompatibilidades de tipos detectadas por TypeScript.
- Modify: `c:\dev\git\appcasa-frontend\src\app\core\guards\auth.guard.ts`
  - Verificar que la ruta de redireccion exista en el router actual.
- Modify: `c:\dev\git\appcasa-frontend\src\app\core\interceptors\auth.interceptor.ts`
  - Verificar que el manejo de `401` no genere rutas invalidas.

### Task 1: Preflight Del Entorno

**Files:**
- Modify: `c:\dev\git\appcasa-frontend\package.json`
- Modify: `c:\dev\git\appcasa-frontend\package-lock.json`

- [ ] **Step 1: Verificar version de Node y npm**

Run:

```bash
node -v
npm -v
```

Expected:

```text
Node >= 20.19.0
npm instalado y funcional
```

- [ ] **Step 2: Verificar estado base del proyecto antes de tocar dependencias**

Run:

```bash
npm run build
```

Expected:

```text
El comando puede fallar, pero deja claro el primer error real del baseline para comparar despues del upgrade.
```

- [ ] **Step 3: Tomar snapshot del manifiesto actual**

Code to keep in view while editing `c:\dev\git\appcasa-frontend\package.json`:

```json
{
  "dependencies": {
    "@angular/common": "^17.3.0",
    "@angular/core": "^17.3.0",
    "@ionic/angular": "^8.0.0",
    "@capacitor/core": "^6.0.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.3.0",
    "@angular-devkit/build-angular": "^17.3.0",
    "@ionic/angular-toolkit": "^11.0.0",
    "@capacitor/cli": "^6.0.0",
    "typescript": "~5.4.0"
  }
}
```

- [ ] **Step 4: Confirmar que el proyecto usa npm y lockfile versionado**

Run:

```bash
dir package-lock.json
```

Expected:

```text
package-lock.json presente en la raiz del proyecto
```

- [ ] **Step 5: Commit del punto de partida**

```bash
git add package.json package-lock.json
git commit -m "chore: snapshot before angular 21 migration"
```

### Task 2: Migrar Angular Y Toolchain Base

**Files:**
- Modify: `c:\dev\git\appcasa-frontend\package.json`
- Modify: `c:\dev\git\appcasa-frontend\package-lock.json`

- [ ] **Step 1: Actualizar el manifiesto a Angular 21 y TypeScript 5.9**

Replace the relevant sections in `c:\dev\git\appcasa-frontend\package.json` with:

```json
{
  "dependencies": {
    "@angular/common": "^21.2.0",
    "@angular/compiler": "^21.2.0",
    "@angular/core": "^21.2.0",
    "@angular/forms": "^21.2.0",
    "@angular/platform-browser": "^21.2.0",
    "@angular/platform-browser-dynamic": "^21.2.0",
    "@angular/router": "^21.2.0",
    "@ionic/angular": "^8.8.7",
    "ionicons": "^7.0.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.8.0",
    "zone.js": "~0.15.1"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^21.2.0",
    "@angular/cli": "^21.2.0",
    "@angular/compiler-cli": "^21.2.0",
    "@ionic/angular-toolkit": "^12.3.0",
    "@types/jasmine": "~5.1.0",
    "@types/node": "^20.19.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.9.3"
  }
}
```

- [ ] **Step 2: Simplificar el script de sincronizacion con Capacitor**

In `c:\dev\git\appcasa-frontend\package.json`, replace:

```json
"cap:sync": "ionic build && cap sync"
```

with:

```json
"cap:sync": "npm run build && npx cap sync"
```

- [ ] **Step 3: Instalar dependencias actualizadas**

Run:

```bash
npm install
```

Expected:

```text
node_modules regenerado y package-lock.json actualizado a las nuevas versiones
```

- [ ] **Step 4: Ejecutar migraciones oficiales del CLI**

Run:

```bash
npx ng update @angular/core @angular/cli --from 17 --to 21 --migrate-only --allow-dirty
```

Expected:

```text
Angular aplica las migraciones de codigo y configuracion compatibles con el salto de version
```

- [ ] **Step 5: Commit del bloque Angular**

```bash
git add package.json package-lock.json angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json src/main.ts src/test.ts
git commit -m "chore: migrate angular toolchain to v21"
```

### Task 3: Alinear Ionic Y Capacitor

**Files:**
- Modify: `c:\dev\git\appcasa-frontend\package.json`
- Modify: `c:\dev\git\appcasa-frontend\package-lock.json`
- Modify: `c:\dev\git\appcasa-frontend\capacitor.config.ts`

- [ ] **Step 1: Subir todos los paquetes de Capacitor a la linea 8**

Update the Capacitor packages in `c:\dev\git\appcasa-frontend\package.json` to:

```json
{
  "dependencies": {
    "@capacitor/android": "^8.0.0",
    "@capacitor/app": "^8.0.0",
    "@capacitor/core": "^8.0.0",
    "@capacitor/haptics": "^8.0.0",
    "@capacitor/ios": "^8.0.0",
    "@capacitor/keyboard": "^8.0.0",
    "@capacitor/local-notifications": "^8.0.0",
    "@capacitor/status-bar": "^8.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^8.0.0"
  }
}
```

- [ ] **Step 2: Reinstalar con Ionic y Capacitor alineados**

Run:

```bash
npm install
```

Expected:

```text
Sin conflictos bloqueantes de peerDependencies entre Angular 21, Ionic 8.x y Capacitor 8.x
```

- [ ] **Step 3: Mantener `webDir` estable para Capacitor**

Ensure `c:\dev\git\appcasa-frontend\capacitor.config.ts` keeps this shape:

```ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.appcasa.app',
  appName: 'AppCasa',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#1E4D9B',
      sound: 'beep.wav',
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#1E4D9B',
      showSpinner: false,
    },
  },
};

export default config;
```

- [ ] **Step 4: Verificar la CLI local de Capacitor**

Run:

```bash
npx cap --version
```

Expected:

```text
8.x.x
```

- [ ] **Step 5: Commit del bloque mobile**

```bash
git add package.json package-lock.json capacitor.config.ts
git commit -m "chore: upgrade ionic and capacitor compatibility"
```

### Task 4: Corregir Workspace Y Configuracion De Build

**Files:**
- Modify: `c:\dev\git\appcasa-frontend\angular.json`
- Modify: `c:\dev\git\appcasa-frontend\tsconfig.json`
- Modify: `c:\dev\git\appcasa-frontend\tsconfig.app.json`
- Modify: `c:\dev\git\appcasa-frontend\tsconfig.spec.json`
- Modify: `c:\dev\git\appcasa-frontend\src\main.ts`

- [ ] **Step 1: Eliminar la clave `defaultProject` que ya genera warning**

In `c:\dev\git\appcasa-frontend\angular.json`, remove:

```json
"defaultProject": "appcasa",
```

so the file starts like:

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "appcasa": {
```

- [ ] **Step 2: Mantener builders conocidos salvo que la migracion los cambie**

Ensure `c:\dev\git\appcasa-frontend\angular.json` still contains valid Angular 21 builders:

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser"
},
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server"
},
"test": {
  "builder": "@angular-devkit/build-angular:karma"
}
```

- [ ] **Step 3: Alinear `tsconfig.json` con Angular 21 sin introducir standalone**

Use this compiler baseline in `c:\dev\git\appcasa-frontend\tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

- [ ] **Step 4: Mantener bootstrap clasico en `main.ts` si sigue compilando**

Ensure `c:\dev\git\appcasa-frontend\src\main.ts` remains:

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

- [ ] **Step 5: Commit de configuracion**

```bash
git add angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json src/main.ts
git commit -m "chore: reconcile angular 21 workspace config"
```

### Task 5: Reconciliar Tests De Angular 21

**Files:**
- Modify: `c:\dev\git\appcasa-frontend\karma.conf.js`
- Modify: `c:\dev\git\appcasa-frontend\src\test.ts`
- Modify: `c:\dev\git\appcasa-frontend\tsconfig.spec.json`

- [ ] **Step 1: Mantener el bootstrap de tests compatible con Angular 21**

Ensure `c:\dev\git\appcasa-frontend\src\test.ts` contains:

```ts
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
```

- [ ] **Step 2: Confirmar tipos de Jasmine en spec tsconfig**

Ensure `c:\dev\git\appcasa-frontend\tsconfig.spec.json` contains:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

- [ ] **Step 3: Mantener la infraestructura de Karma con el plugin Angular**

Ensure `c:\dev\git\appcasa-frontend\karma.conf.js` contains:

```js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/appcasa'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
  });
};
```

- [ ] **Step 4: Ejecutar la suite de tests para descubrir roturas de infraestructura**

Run:

```bash
npm run test -- --watch=false --browsers=ChromeHeadless
```

Expected:

```text
Si falla, el error debe apuntar a imports, testing environment o helpers reales del stack Angular 21.
```

- [ ] **Step 5: Commit del bloque de test**

```bash
git add karma.conf.js src/test.ts tsconfig.spec.json
git commit -m "test: reconcile angular 21 karma setup"
```

### Task 6: Corregir Bloqueos Reales De Codigo

**Files:**
- Modify: `c:\dev\git\appcasa-frontend\src\app\core\models\domain.models.ts`
- Modify: `c:\dev\git\appcasa-frontend\src\app\core\guards\auth.guard.ts`
- Modify: `c:\dev\git\appcasa-frontend\src\app\core\interceptors\auth.interceptor.ts`

- [ ] **Step 1: Resolver el conflicto de `Herramienta.version`**

In `c:\dev\git\appcasa-frontend\src\app\core\models\domain.models.ts`, make `Herramienta` compatible with `BaseEntity` by using one of these valid shapes:

```ts
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

export interface Herramienta extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  ruta?: string;
  activa: boolean;
  esCore: boolean;
  orden: number;
}
```

or, if the field must stay explicit:

```ts
export interface Herramienta extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  ruta?: string;
  version?: number;
  activa: boolean;
  esCore: boolean;
  orden: number;
}
```

- [ ] **Step 2: Mantener redireccion de auth hacia una ruta existente**

Ensure `c:\dev\git\appcasa-frontend\src\app\core\guards\auth.guard.ts` contains:

```ts
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true;
  }
  this.router.navigate(['/auth']);
  return false;
}
```

- [ ] **Step 3: Mantener manejo de `401` alineado con el router real**

Ensure `c:\dev\git\appcasa-frontend\src\app\core\interceptors\auth.interceptor.ts` contains:

```ts
return next.handle(request).pipe(
  catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/auth']);
    }
    return throwError(() => error);
  })
);
```

- [ ] **Step 4: Ejecutar chequeo de compilacion tras los arreglos**

Run:

```bash
npm run build
```

Expected:

```text
Compilacion sin errores TypeScript ni errores de rutas basicas del arranque
```

- [ ] **Step 5: Commit de adaptaciones de codigo**

```bash
git add src/app/core/models/domain.models.ts src/app/core/guards/auth.guard.ts src/app/core/interceptors/auth.interceptor.ts
git commit -m "fix: resolve angular 21 migration blockers"
```

### Task 7: Validacion Final Y Sync De Capacitor

**Files:**
- Modify: `c:\dev\git\appcasa-frontend\package-lock.json`
- Modify: `c:\dev\git\appcasa-frontend\angular.json`
- Modify: `c:\dev\git\appcasa-frontend\package.json`

- [ ] **Step 1: Verificar build de produccion**

Run:

```bash
npm run build
```

Expected:

```text
Build de produccion completado y carpeta `www` actualizada
```

- [ ] **Step 2: Verificar servidor de desarrollo**

Run:

```bash
npm run start
```

Expected:

```text
Angular dev server levanta sin errores de builders ni de dependencias faltantes
```

- [ ] **Step 3: Verificar tests finales**

Run:

```bash
npm run test -- --watch=false --browsers=ChromeHeadless
```

Expected:

```text
Suite de tests operativa o errores ya limitados a specs concretos, no al toolchain
```

- [ ] **Step 4: Ejecutar sincronizacion de Capacitor**

Run:

```bash
npx cap sync
```

Expected:

```text
Plataformas nativas sincronizadas con el artefacto web generado en `www`
```

- [ ] **Step 5: Commit final**

```bash
git add package.json package-lock.json angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json karma.conf.js capacitor.config.ts src/main.ts src/test.ts src/app
git commit -m "feat: upgrade project to angular 21"
```

## Self-Review

- Spec coverage:
  - Dependencias Angular, Ionic y Capacitor: cubiertas en Task 2 y Task 3.
  - Configuracion y builders: cubiertos en Task 4.
  - Tests: cubiertos en Task 5.
  - Adaptaciones de codigo: cubiertas en Task 6.
  - Validacion `start`, `build`, `test` y `cap sync`: cubierta en Task 7.
- Placeholder scan:
  - No hay `TODO`, `TBD` ni referencias a "hacer despues".
  - Los comandos y snippets apuntan a archivos concretos del proyecto.
- Type consistency:
  - El plan conserva `NgModule`, `platformBrowserDynamic`, `Karma` y `CapacitorConfig`.
  - La correccion de `Herramienta.version` es consistente con `BaseEntity.version?: number`.
