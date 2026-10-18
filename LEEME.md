# Val Gelish · web

Página estática (HTML/CSS/JS, sin frameworks). Se puede subir tal cual a Netlify, Vercel o GitHub Pages.

## Estructura
- `index.html`: la página
- `css/styles.css`: diseño (paleta nude en `:root`)
- `js/config.js`: **lo que se edita**: número de WhatsApp, servicios y precios, hoja de esmaltes
- `js/esmaltes.js`: lista de respaldo de colores (solo si la hoja de Google no carga)
- `js/app.js`: lógica (selección, resumen y mensaje de WhatsApp)
- `assets/ig/`: fotos tomadas de @valgelish
- `assets/hero.mp4`: video del header (si no existe, se muestra un collage animado de fotos)

## Servicios y precios
Pestaña `Servicios` de la hoja de Google **"Val Gelish · Esmaltes (catálogo web)"**:

| servicio | precio | tipo | descripcion | activo |
|---|---|---|---|---|
| Gelish liso | 150 | Servicio | Color sólido de larga duración… | SI |

- **Cambiar precio:** edita el número.
- **Servicio nuevo:** agrega una fila. `tipo` = `Servicio` (va en la lista principal) o `Extra` (se suma aparte).
- **Ocultarlo un tiempo:** `activo` = `NO`. **Quitarlo:** borra la fila.

## Agregar o quitar esmaltes
Pestaña `Esmaltes` de la misma hoja:

| codigo | marca | nombre | color | familia | disponible | foto |
|---|---|---|---|---|---|---|
| E050 | Le Mussa | Rosa chicle suave | #E58C99 | Rosas | SI | (opcional) |

La celda de `color` se pinta del tono para comparar con el esmalte real. Los códigos en amarillo están por confirmar. A Vale le llega por WhatsApp el nombre con marca y código.

- **Agregar:** escribe una fila nueva.
- **Se acabó:** cambia `disponible` a `NO`. Aparece tachado como "Agotado" y no se puede elegir.
- **Quitar para siempre:** borra la fila.
- `color` es el código del tono. Para sacarlo, busca "color picker" en Google, toma el color de una foto y copia el `#XXXXXX`.

Los cambios aparecen en la web al recargarla. La hoja debe estar compartida como **"Cualquier persona con el enlace → Lector"**.

## Probarla en tu compu
```
node .claude/serve.js
```
y abre http://localhost:5173

## Prompt del video del header (Google Flow / Veo)
> Slow, dreamy macro shot of a woman's hand with glossy almond-shaped gel nails in soft nude-pink polish, resting on cream linen. A manicurist's brush glides a final clear coat, catching a soft highlight. Warm natural window light, beige, blush and cream palette, shallow depth of field, gentle camera drift to the right. Minimal, elegant, luxurious beauty-salon aesthetic. No text, no logos. 16:9, cinematic, 8 seconds, seamless loop feel.
