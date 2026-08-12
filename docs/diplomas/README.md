# Diplomas Ulpan — Canva Bulk Create

Plantillas ilustradas con la Mora Maggie y CSV listo para **Canva Bulk Create**.

## Archivos

| Archivo | Uso |
|---------|-----|
| [`ulpan-diplomas-bulk-create.csv`](./ulpan-diplomas-bulk-create.csv) | Datos para Bulk Create (13 diplomas) |
| [`../images/diplomas/diploma-unit.jpg`](../images/diplomas/diploma-unit.jpg) | Fondo: completar unidad |
| [`../images/diplomas/diploma-streak.jpg`](../images/diplomas/diploma-streak.jpg) | Fondo: racha de estudio |
| [`../images/diplomas/diploma-lessons.jpg`](../images/diplomas/diploma-lessons.jpg) | Fondo: hito de lecciones |
| [`../images/diplomas/diploma-template-master.jpg`](../images/diplomas/diploma-template-master.jpg) | Plantilla maestra / referencia |

En la app: ruta `/certificados` (vista previa + descarga del CSV).

## Cómo usar Bulk Create en Canva

1. Entrá a [Canva](https://www.canva.com/) → **Create a design** → tamaño **Landscape A4** (297 × 210 mm) o **Presentation 16:9**.
2. Subí una imagen de fondo (`diploma-unit.jpg`, `diploma-streak.jpg` o `diploma-lessons.jpg`) a **Uploads** y colocála a pantalla completa.
3. Añadí **text boxes** editables (fuente sugerida: serif elegante) y conectalos a estas columnas del CSV:

   | Columna CSV | Contenido |
   |-------------|-----------|
   | `title` | Título del diploma |
   | `placeholder_name` | Nombre del estudiante (reemplazá el placeholder) |
   | `subtitle` | Unidad / categoría |
   | `detail` | Detalle del logro |
   | `hebrew_title` | Frase en hebreo |
   | `brand` | Ulpan con la Mora Maggie |
   | `image_hint` | Qué JPG de fondo usar (`diploma-unit`, etc.) |

4. Dejá un espacio central limpio (ya está en el arte) para el nombre.
5. Menú **Apps** → **Bulk Create**.
6. **Upload data** → elegí `ulpan-diplomas-bulk-create.csv`.
7. Conectá cada columna al text box correspondiente.
8. Generá el lote → descargá PDF/PNG o compartí enlace.

Tip: filtrá el CSV por `kind` (`unit` / `streak` / `lessons`) y usá el fondo que indica `image_hint` para ese lote.

## Filas incluidas

- 6 unidades A1 (alefato → calendario sionista)
- 4 rachas (3, 7, 14, 30 días)
- 3 hitos de lecciones (5, 10, 20)

## En la web (sin Canva)

`/certificados` genera diplomas on-the-fly con el mismo arte de Maggie según el logro desbloqueado, e imprimí / guardá PDF desde el navegador.
