# NexoCreator · Estado maestro

## Regla principal

Antes de responder sobre el estado del proyecto, comprobar acceso real y leer archivos reales.

No asumir.
No inventar.
No decir que algo está reparado sin verificarlo primero.

## Definición oficial del proyecto

NexoCreator es una app independiente para crear fichas visuales y estructuradas, revisarlas, validarlas y enviarlas a AcuarioNexo.

NexoCreator NO es biblioteca, wiki ni catálogo final.

AcuarioNexo es quien recibe las fichas validadas y las usa como conocimiento estructurado.

## Flujo oficial objetivo

1. CREACIÓN: el usuario crea una ficha desde foto, datos base o ficha vacía.
2. BORRADOR: la ficha queda guardada mientras se edita.
3. EN_REVISIÓN: la ficha pasa a cola de revisión antes de considerarse válida.
4. VALIDADA: la ficha revisada queda aprobada para envío.
5. ENVIADA_A_ACUARIONEXO: la ficha validada se entrega a AcuarioNexo.

Exportar JSON es solo una salida manual. No equivale a enviar a AcuarioNexo.

## Estado real verificado el 2026-06-05

Archivos leídos:

- `index.html`
- `assets/js/app.js`
- `PROJECT_STATE.md`

Estado real actual de la app:

- Existe creación de ficha vacía.
- Existe creación desde foto.
- Existe guardado local en `localStorage` con clave `nexocreator_fichas_v1`.
- Existe estado `BORRADOR`.
- Existe vista previa.
- Existe exportación manual de JSON.
- No existe todavía flujo interno de revisión desde la app.
- No existe todavía estado `VALIDADA` en la app.
- No existe todavía estado `ENVIADA_A_ACUARIO_NEXO` o `ENVIADA_A_ACUARIONEXO` en la app.
- No existe todavía integración real de envío a AcuarioNexo.
- `review_queue/` existe como estructura del proyecto, pero la app actual no la usa todavía.

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

## Forma correcta de trabajar

Cada problema se trata de uno en uno:

1. Localizar leyendo archivos reales afectados.
2. Corregir solo los archivos reales necesarios.
3. Verificar leyendo de nuevo los archivos modificados.
4. Cerrar el punto con archivo modificado, cambio realizado y verificación.

## Siguiente punto pendiente

P2. Integrar `review_queue/` en el flujo real de la app, sin crear parches al final de archivos y sin sustituir la app por otra base.
