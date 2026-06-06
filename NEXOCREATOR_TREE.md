# NEXOCREATOR_TREE

Fuente: ZIP auditado `nexocreator-main-7.zip`.

Este archivo es el árbol maestro actual de NexoCreator.

Regla de uso:

- Antes de buscar estructura, consultar este archivo.
- Antes de afirmar que una carpeta o archivo existe, comprobarlo aquí y después leer el archivo real afectado.
- Si el proyecto cambia, actualizar este árbol; no usar árboles antiguos.

```text
nexocreator-main
├── PROJECT_STATE.md
├── README.md
├── index.html
├── manifest.webmanifest
├── sw.js
│
├── assets
│   ├── css
│   │   └── styles.css
│   └── js
│       └── app.js
│
├── docs
│   ├── fichas
│   │   ├── 00_GUIA_GENERAL_FICHAS.md
│   │   ├── FICHA_PATRON_MAESTRA.md
│   │   ├── alimento.md
│   │   ├── coral.md
│   │   ├── equipamiento.md
│   │   ├── invertebrado.md
│   │   ├── medicamento.md
│   │   ├── microfauna.md
│   │   ├── pez_dulce.md
│   │   ├── pez_marino.md
│   │   ├── producto.md
│   │   └── sal.md
│   │
│   └── plantillas
│       ├── PLANTILLA_DULCE_AMAZONICO_V1.md
│       ├── PLANTILLA_DULCE_BETTA_ASIATICO_V1.md
│       ├── PLANTILLA_DULCE_PLANTADO_V1.md
│       ├── PLANTILLA_MARINA_PREMIUM_V1.md
│       ├── PLANTILLA_PLANTAS_ACUATICAS_V1.md
│       ├── PLANTILLA_PRODUCTO_CLINICO_V1.md
│       ├── PLANTILLA_PRODUCTO_NEUTRA_V1.md
│       └── REGLA_MICROFAUNA_MARINA_V1.md
│
├── drafts
│   └── manifest.json
│
└── icons
    └── book-fish.svg
```

## Bloques principales

- `PROJECT_STATE.md`: estado maestro y reglas de trabajo del proyecto.
- `assets/js/app.js`: lógica principal de NexoCreator.
- `assets/css/styles.css`: estilos principales.
- `docs/fichas/`: esquemas de cada tipo de ficha.
- `docs/plantillas/`: plantillas visuales/reglas de diseño.
- `drafts/manifest.json`: zona de borradores/índice de fichas de trabajo.
- `icons/book-fish.svg`: icono principal.

## Estado respecto al árbol anterior

El árbol anterior estaba basado en `nexocreator-main-2.zip` y ya no era válido.

Cambios relevantes del árbol actual:

- `review_queue/` ya no aparece en el árbol actual.
- `review_queue/amphiprion-ocellaris-pendiente-revision.md` ya no aparece en el árbol actual.
- `drafts/manifest.json` sí aparece como parte viva del proyecto.

## Regla operativa para fichas

Cuando el usuario pida una ficha indicando solo el nombre:

1. Identificar especie o producto.
2. Determinar categoría.
3. Leer el esquema correspondiente en `docs/fichas/`.
4. Leer la plantilla visual correspondiente en `docs/plantillas/`.
5. Generar ficha.
6. Insertar/guardar siguiendo el flujo real de `assets/js/app.js` y `drafts/manifest.json`.

No pedir al usuario rutas, carpetas ni plantillas si pueden deducirse desde este árbol y los archivos maestros.
