# NexoCreator · Estado maestro

## Regla principal

Antes de responder sobre el estado del proyecto, comprobar acceso real y leer archivos reales.

No asumir.
No inventar.
No decir que no hay acceso sin comprobarlo primero.

## Objetivo del proyecto

NexoCreator es una app independiente para crear fichas visuales y estructuradas.

El flujo principal es:

1. El usuario aporta una foto o datos base.
2. Se crea una ficha según el tipo correspondiente.
3. La ficha queda guardada como borrador o ficha terminada.
4. La ficha exporta un JSON limpio para AcuarioNexo.
5. AcuarioNexo usa ese JSON como conocimiento estructurado.

## Tipos de ficha previstos

- Pez marino
- Pez dulce
- Coral
- Invertebrado
- Planta
- Microfauna
- Medicamento
- Sal
- Producto
- Equipamiento
- Alimento

## Regla de trabajo para nuevas fichas

Cada tipo de ficha debe tener su propia guía de creación.

Las guías deben guardarse en:

`docs/fichas/`

Cada guía debe indicar:

- Qué datos mínimos necesita la ficha.
- Qué campos visuales debe mostrar.
- Qué campos debe exportar en JSON.
- Qué reglas de compatibilidad o uso debe respetar.
- Qué información debe buscar/verificar la IA.
- Qué no debe inventar.

## Estado actual conocido

Pendiente de comprobar leyendo archivos reales:

- `index.html`
- `assets/js/app.js`
- estructura actual de carpetas
- duplicados entre `index.html` y `app.js`

## Siguiente tarea exacta

Crear la carpeta de reglas de fichas y empezar por la guía base común:

`docs/fichas/00_GUIA_GENERAL_FICHAS.md`

Después crear guías específicas, empezando por:

1. `pez_marino.md`
2. `pez_dulce.md`
3. `coral.md`
4. `invertebrado.md`
5. `medicamento.md`
6. `sal.md`

## Forma correcta de trabajar

Al iniciar una sesión:

1. Leer `PROJECT_STATE.md`.
2. Leer los archivos reales relacionados con la tarea.
3. Ejecutar solo la siguiente tarea lógica.
4. Probar si procede.
5. Actualizar este archivo con el nuevo estado.
