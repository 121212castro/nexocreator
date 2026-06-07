# Pez marino

## Estilo visual fijo

Este tipo de ficha debe mantener una identidad visual propia.

## Plantilla visual de portada

La portada de pez marino se guarda como plantilla reutilizable.

El fondo y el estilo de letra son fijos.

Los textos son variables:

- `{{nombre_cientifico}}`
- `{{nombre_comun}}`

Ejemplo de referencia:

- `{{nombre_cientifico}}` = *Amphiprion ocellaris*
- `{{nombre_comun}}` = Pez payaso Ocellaris

Cuando se cree otra ficha de pez marino, solo deben cambiar:

- el pez protagonista,
- el nombre científico,
- el nombre común.

No debe cambiar:

- el fondo,
- la composición,
- la colocación del texto,
- el tipo de letra,
- el estilo de separador,
- la atmósfera visual.

### Fondo fijo
- Fondo marino azul oscuro.
- Ambiente de acuario reef o arrecife.
- Luz superior tipo acuario, con sensación de profundidad.
- Rocas/coralinas laterales.
- Zona central libre para colocar el pez protagonista.
- Fondo con profundidad, no plano.
- No usar fondos blancos ni fondos de catálogo.

### Tipografía fija
- Nombre científico grande, elegante y en cursiva.
- Estilo serif elegante para el nombre científico.
- Color principal del nombre científico: blanco cálido.
- Nombre común debajo, más pequeño y legible.
- Color del nombre común: dorado cálido.
- El nombre científico siempre tiene prioridad visual.

### Composición fija
- Imagen horizontal tipo portada.
- Pez protagonista centrado o ligeramente superior.
- Texto inferior centrado.
- Separador decorativo fino entre nombre científico y nombre común.
- Mantener aire visual alrededor del pez.

## Referencia visual base

Primera referencia validada:

- *Amphiprion ocellaris*
- Pez payaso Ocellaris
- Fondo azul marino con arrecife.
- Nombre científico grande en cursiva.
- Nombre común debajo en dorado/blanco cálido.

## Datos obligatorios
- Nombre común
- Nombre científico
- Familia
- Tamaño adulto
- Dieta
- Compatibilidad
- Nivel de dificultad
- Reef safe

## Datos de acuario
- Litros mínimos
- Temperatura
- Salinidad
- pH

## Exportación JSON
Mantener todos los datos estructurados y cover_image.

## Regla clave

Para peces marinos, la ficha se crea primero como ficha visual con este estilo. Después se genera el JSON desde esa ficha, no al revés.
