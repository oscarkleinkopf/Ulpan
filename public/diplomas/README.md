# Diplomas Ulpan — Mora Maggie

Lote de **13 diplomas ya generados** con el arte de la Mora Maggie, más CSV opcional para Canva.

## Descargas rápidas

| Archivo | Uso |
|---------|-----|
| [`ulpan-diplomas-maggie.zip`](./ulpan-diplomas-maggie.zip) | **Los 13 diplomas JPG** listos para imprimir / WhatsApp |
| [`generated-manifest.json`](./generated-manifest.json) | Índice de cada diploma |
| [`../images/diplomas/generated/`](../images/diplomas/generated/) | JPG + WebP individuales |
| [`ulpan-diplomas-bulk-create.csv`](./ulpan-diplomas-bulk-create.csv) | Datos para Canva Bulk Create (opcional) |

En la app: `/certificados` (galería + ZIP + descarga por diploma).

## Diplomas incluidos

- **Unidades (6):** alefato, primeras palabras, gramática, frases útiles, sionismo, calendario sionista  
- **Rachas (4):** 3, 7, 14, 30 días  
- **Lecciones (3):** 5, 10, 20  

Nombre placeholder: `Talmid/a del Ulpan`. En `/certificados`, con tu nombre en **Progreso**, usá **Con mi nombre** / **Descargar con mi nombre** para generar el JPG personalizado en el navegador.

## Canva (opcional)

Si preferís regenerar desde Canva:

1. Subí el fondo según `image_hint` del CSV  
2. Apps → Bulk Create → importá el CSV  
3. Mapeá columnas a text boxes  

## Regenerar en el repo

```bash
python3 scripts/generate-diplomas.py   # overlay sobre plantillas (fallback)
# o reemplazar PNGs en /opt/cursor/artifacts/assets/diploma-*.png y recomprimir
```
