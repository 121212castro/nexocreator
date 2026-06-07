# Pez dulce

## Regla visual principal

Los peces de agua dulce no usan una única plantilla.

NexoCreator debe elegir una de estas tres plantillas según el tipo de pez, biotopo o grupo.

## PLANTILLA_DULCE_AMAZONICO_V1

### Uso
Para peces amazónicos o de aguas tropicales con ambiente de raíces, hojas y vegetación.

### Ejemplos
- Pterophyllum scalare / Escalar
- Symphysodon spp. / Disco
- Paracheirodon axelrodi / Cardenal
- Corydoras spp.
- Apistogramma spp.

### Fondo fijo
- Río o acuario amazónico.
- Tonos verdes y marrones.
- Raíces y troncos laterales.
- Hojas en el fondo.
- Luz filtrada desde arriba.
- Ambiente natural, profundo y tranquilo.

### Variables
- `{{imagen_principal}}`
- `{{nombre_cientifico}}`
- `{{nombre_comun}}`

## PLANTILLA_DULCE_PLANTADO_V1

### Uso
Para peces de comunitario plantado, especies pequeñas de cardumen, gambas y especies que encajan mejor en acuario verde limpio.

### Ejemplos
- Rasboras
- Neones
- Otocinclus
- Gambas de agua dulce
- Peces pequeños de comunitario

### Fondo fijo
- Acuario plantado premium.
- Verde intenso.
- Plantas desenfocadas.
- Agua clara.
- Burbujas o partículas suaves.
- Aspecto moderno y limpio.

### Variables
- `{{imagen_principal}}`
- `{{nombre_cientifico}}`
- `{{nombre_comun}}`

## PLANTILLA_DULCE_BETTA_ASIATICO_V1

### Uso
Para bettas, gouramis y especies asiáticas de aguas lentas o vegetación densa.

### Ejemplos
- Betta splendens / Betta
- Trichogaster spp. / Gourami
- Trichopsis spp.
- Boraras spp. si se decide usar ambiente asiático

### Fondo fijo
- Agua dulce tranquila.
- Tonos cálidos y verdes suaves.
- Hojas, raíces finas o vegetación flotante.
- Ambiente íntimo y calmado.
- Iluminación suave.

### Variables
- `{{imagen_principal}}`
- `{{nombre_cientifico}}`
- `{{nombre_comun}}`

## Regla de selección automática

Cuando se cree una ficha de pez dulce, NexoCreator debe elegir plantilla según especie o grupo:

- Escalares, discos, corydoras y apistogrammas → `PLANTILLA_DULCE_AMAZONICO_V1`
- Neones, rasboras, otocinclus y comunitario plantado → `PLANTILLA_DULCE_PLANTADO_V1`
- Bettas, gouramis y especies asiáticas tranquilas → `PLANTILLA_DULCE_BETTA_ASIATICO_V1`

Si hay duda, marcar la plantilla como pendiente de revisión y no inventar biotopo.

## Tipografía común para peces dulces

- Nombre científico grande, elegante y en cursiva.
- Estilo serif elegante.
- Nombre común debajo, más pequeño y legible.
- Mantener composición horizontal tipo portada.

## Datos obligatorios
- Nombre común
- Nombre científico
- Familia
- Tamaño adulto
- Dieta
- Compatibilidad
- GH
- KH
- pH
- Temperatura

## Exportación
JSON estructurado con cover_image y nombre de plantilla usada.
