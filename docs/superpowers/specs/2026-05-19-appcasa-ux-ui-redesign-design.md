# Diseno De Rediseno Integral UX/UI De AppCasa

## Contexto

`AppCasa` es una aplicacion `Ionic + Angular + Capacitor` orientada a gestion domestica y colaboracion familiar.

La base actual es funcional, pero la experiencia se apoya demasiado en patrones visuales genericos de Ionic:

- `toolbars` y tarjetas con apariencia por defecto
- jerarquia visual limitada entre pantallas
- footer con demasiada carga al mismo nivel
- selector de hogar repetido como bloque aislado
- estados vacios, cargas y acciones rapidas resueltos de forma desigual

El proyecto ya soporta `multi-hogar`, por lo que el rediseño debe usar ese contexto como pieza central de la experiencia y no como elemento accesorio.

## Objetivo

Rediseñar completamente la UX/UI de `AppCasa` para que se sienta como un centro operativo del hogar:

- mas clara en uso diario
- mas calida y familiar en personalidad visual
- menos generica y menos dependiente del look default de Ionic
- mas consistente entre pantallas, componentes y estados
- mejor organizada alrededor del `hogar activo` y de las tareas cotidianas

La prioridad principal es mejorar la `UX diaria`, no solo refrescar el aspecto visual.

## Alcance

El rediseño abarca toda la aplicacion:

- autenticacion y onboarding
- dashboard / inicio
- tareas
- calendario
- familia
- recordatorios
- listas
- mascotas
- calculadoras
- perfil y ajustes
- shell general de navegacion y layout

Se permite un cambio alto de interaccion y estructura si eso mejora la experiencia.

## Fuera De Alcance

Quedan fuera de alcance en esta fase:

- cambios de backend o contrato API salvo necesidad menor para soporte visual
- reescritura arquitectonica profunda de servicios o dominio
- migraciones tecnicas no relacionadas con UX/UI
- creacion de funcionalidades nuevas que no aporten directamente al rediseno

Se aceptan ajustes puntuales de estructura de frontend cuando sean necesarios para sostener el nuevo sistema visual y de navegacion.

## Enfoque Elegido

Se adopta un enfoque `hogar-first`.

Esto significa que la app deja de comportarse como un conjunto de modulos equivalentes y pasa a organizarse alrededor de una pregunta principal:

`que necesita hacer este hogar hoy`

Consecuencias directas del enfoque:

- el `hogar activo` pasa a ser contexto global visible
- `Inicio` se convierte en tablero vivo del dia
- `Tareas` se convierte en vista operativa priorizada
- la navegacion principal se simplifica para favorecer los flujos frecuentes
- las herramientas secundarias dejan de competir visualmente con las areas troncales

## Principios De Diseno

- Priorizar acciones frecuentes sobre exploracion de modulos
- Mantener un tono visual calido, cercano y domestico
- Reducir friccion en acciones repetidas
- Dar una jerarquia clara a contexto, accion principal y contenido
- Evitar saturacion visual, pero sin caer en una interfaz fria o corporativa
- Hacer que estados, prioridades y responsabilidades se entiendan de un vistazo
- Mantener consistencia real entre pantallas, no solo consistencia cromatica

## Arquitectura De Navegacion

La navegacion principal pasa a organizarse en 5 areas:

1. `Inicio`
2. `Tareas`
3. `Calendario`
4. `Familia`
5. `Mas`

### Inicio

Area principal para:

- contexto del hogar
- resumen del dia
- pendientes prioritarios
- acciones rapidas
- visibilidad de actividad cercana

### Tareas

Area operativa para:

- ver pendientes
- filtrar por estado o criterio
- crear tareas
- completar y editar rapidamente
- entender prioridad, asignacion y vencimiento

### Calendario

Area temporal para:

- agenda familiar
- eventos y recordatorios
- proximos hitos

### Familia

Area colaborativa para:

- miembros
- roles
- reparto de responsabilidad
- invitaciones y coordinacion

### Mas

Contenedor de herramientas secundarias:

- mascotas
- listas
- calculadoras
- perfil
- ajustes

## Cambios Estructurales Clave

- El footer actual deja de mostrar demasiadas opciones largas al mismo nivel
- La app adopta una `tab bar` compacta con labels cortos e iconos consistentes
- `Perfil` deja de fragmentar la cabecera y pasa a formar parte de `Mas` o de acciones contextuales del header
- El selector de hogar deja de repetirse como tarjeta fija y se convierte en patron global reutilizable
- Las herramientas secundarias ya no compiten con `Inicio`, `Tareas`, `Calendario` y `Familia`

## Sistema Visual

La direccion visual debe sentirse `calida, familiar y limpia`.

No se busca una interfaz corporativa ni una copia del look base de Ionic.

### Paleta

La paleta propuesta se apoya en:

- azul profundo y suave como color estructural
- fondos neutros calidos y ligeramente cremosos
- acentos de apoyo como coral, salvia o ambar para diferenciar estados y prioridades

Objetivo:

- mantener confianza y orden
- introducir cercania y personalidad
- mejorar contraste y lectura de prioridades sin saturar

### Tipografia

La tipografia debe reforzar jerarquia y legibilidad:

- titulos con peso claro y aire visual
- cuerpo muy legible en movil
- labels secundarios bien diferenciados
- consistencia de tamanos y alturas entre modulos

### Superficies Y Layout

La app debe usar:

- bloques de contenido con intencion, no solo `ion-card` repetidas
- headers con respiracion y contexto
- espaciamiento mas generoso y sistematico
- contrastes por tamano, agrupacion y tono antes que por bordes duros

### Iconografia Y Componentes Visuales

- iconos utiles y serenos
- chips de estado claros
- tarjetas de tarea con informacion escaneable
- empty states utiles con CTA real
- skeletons consistentes y reconocibles

## Sistema De Componentes

Se define una capa reutilizable de UI en `shared` para evitar rediseños aislados por pantalla.

Componentes base previstos:

- `app-shell`
- `context-header`
- `home-switcher`
- `hero-panel`
- `quick-actions`
- `section-block`
- `status-chip`
- `task-card`
- `empty-state`
- `state-banner`
- `filter-bar`
- `member-avatar-group`

Regla principal:

los componentes visuales deben separarse de la logica de datos para que el rediseno sea mantenible y reusable.

## Estrategia Por Pantallas

### Auth

La entrada actual basada en formulario simple sobre degradado se reemplaza por una experiencia mas cuidada:

- propuesta de valor clara
- transicion limpia entre entrar y registrarse
- mejor jerarquia de campos y validaciones
- tono mas humano y confiable
- mejor primer paso para crear o unirse a un hogar

### Inicio

`Inicio` deja de ser solo resumen y pasa a ser tablero del hogar.

Debe incluir:

- contexto del hogar visible
- saludo o encabezado util
- resumen del dia
- acciones rapidas
- secciones de `hoy`, `proximo`, `pendientes importantes` y `actividad`

### Tareas

La pantalla de tareas se replantea como vista de trabajo:

- resumen superior util
- filtros claros
- segmentacion o agrupacion que ayude de verdad
- tarjetas con prioridad, responsable, vencimiento y accion rapida
- mejor vacio cuando no hay tareas

### Calendario

Debe enfatizar tiempo y proximidad:

- agenda clara
- eventos cercanos
- lectura rapida del dia o semana
- transicion natural desde el tablero principal

### Familia

Debe dar mas protagonismo a la colaboracion:

- miembros mas visibles
- lectura de roles o responsabilidades
- conexiones con tareas y contexto del hogar

### Herramientas Secundarias

`Recordatorios`, `Listas`, `Mascotas` y `Calculadoras` comparten el sistema visual y el shell comun, pero con menor peso jerarquico que las areas troncales.

## Patrones De Experiencia Comunes

Todas las pantallas deben compartir:

- header contextual
- accion primaria clara
- estructura de contenido consistente
- estados `loading`, `empty`, `error` y `success` unificados
- feedback claro tras acciones del usuario
- soporte correcto para movil como prioridad principal

## Tratamiento Del Multi-Hogar

`Multi-hogar` se trata como contexto global de la experiencia.

Esto implica:

- visibilidad persistente del hogar activo
- cambio de hogar accesible sin romper el flujo
- contenido y acciones siempre vinculados al contexto activo
- mensajes claros cuando no hay hogar seleccionado o disponible

No se debe repetir el mismo bloque de selector como tarjeta aislada en cada pantalla si puede resolverse mediante un patron global mejor integrado.

## Manejo De Errores Y Estados

El rediseno debe mejorar no solo la estetica sino tambien la interpretacion del estado del sistema.

Se define una estrategia comun para:

- cargas iniciales
- refresco manual
- errores de datos o red
- vacios reales
- confirmaciones y acciones completadas

Los mensajes deben ser mas humanos, directos y accionables.

## Accesibilidad

Requisitos minimos del rediseño:

- contraste suficiente
- targets tactiles adecuados
- labels comprensibles
- foco visible
- dependencias visuales no basadas solo en color

## Criterios De Terminado

El rediseno se considera resuelto cuando:

- existe un shell nuevo y consistente para toda la app
- la navegacion principal queda simplificada segun la arquitectura aprobada
- el sistema visual deja de depender del look generico de Ionic
- `Inicio`, `Tareas`, `Calendario`, `Familia`, `Mas` y `Auth` quedan alineadas con el nuevo lenguaje
- las herramientas secundarias heredan el sistema comun
- el patron `multi-hogar` queda integrado como contexto global
- estados vacios, cargas y errores quedan unificados

## Riesgos

### Riesgo 1: Rediseno solo cosmetico

La app podria verse mejor pero seguir funcionando con la misma friccion diaria.

Mitigacion:

- priorizar arquitectura, jerarquia y flujos antes que el color o decoracion

### Riesgo 2: Fragmentacion entre pantallas

Cada feature podria resolver su UI de forma diferente aunque comparta paleta.

Mitigacion:

- crear componentes y patrones base reutilizables

### Riesgo 3: Navegacion aun saturada

Si demasiadas herramientas siguen compitiendo por primer nivel, la mejora seria limitada.

Mitigacion:

- mover herramientas secundarias a `Mas` y reforzar las areas troncales

### Riesgo 4: Tratamiento inconsistente del contexto hogar

El soporte multi-hogar puede seguir sintiendose accesorio si se resuelve de forma local en cada vista.

Mitigacion:

- convertir `hogar activo` en patron global de shell y cabeceras

## Estrategia De Validacion

La validacion del rediseno debe cubrir:

1. revision visual del shell general
2. revision visual de pantallas clave
3. recorrido manual de flujos diarios
4. comprobacion responsive con prioridad movil
5. validacion basica de accesibilidad

Flujos minimos a revisar:

- entrar o registrarse
- crear hogar o unirse con codigo
- cambiar hogar activo
- revisar tablero principal
- crear tarea
- completar tarea
- navegar entre areas troncales

## Decisiones Explicitas

- El tono visual sera calido y familiar
- La prioridad del producto sera la UX diaria
- El rediseño afectara a toda la app
- Se permiten cambios altos de estructura e interaccion
- La arquitectura principal sera `Inicio`, `Tareas`, `Calendario`, `Familia`, `Mas`
- `Multi-hogar` sera contexto global visible
- Las utilidades secundarias se moveran fuera del primer nivel principal

## Resultado Esperado

Al finalizar la implementacion de este diseno, `AppCasa` debe sentirse como una aplicacion de hogar moderna, coherente y util en el dia a dia:

- facil de entender
- rapida para resolver pendientes
- visualmente propia
- amable en tono
- consistente entre areas

El resultado no debe ser solo una app mas bonita, sino una app mas clara, mas centrada en el hogar y mas eficiente para las rutinas familiares.
