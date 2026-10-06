# Material de terceros / Third-party material

Este repositorio incluye o referencia material que **no** es de propiedad de Osias Kleinkopf. Ese material **no** queda cubierto por `LICENSE` (ni por `LICENSE-CONTENT.md`, si existe). Se rige por la licencia o los términos de su titular.

This repository includes or references material not owned by Osias Kleinkopf. Such material is NOT covered by `LICENSE` (or `LICENSE-CONTENT.md`) and remains under its owners' licenses or terms.

## Inventario

| Material | Ubicación en el repo | Origen / titular | Licencia o términos | Notas |
|---|---|---|---|---|
| Grabaciones de la Mora Maggie y audio guiado | No hay archivos de audio en el repo. Bucket de Supabase `guided-audio` (tabla `guided_audio` en `supabase/schema.sql`; cliente en `src/lib/guidedAudio.ts`) | La Mora Maggie y cada morá/moré que graba | Todos los derechos de sus autores | Excluidas de MIT y de CC BY-NC-SA |
| Voces TTS de respaldo (Web Speech API) | `src/lib/speak.ts` | Navegador / sistema operativo | Términos del proveedor |  |
| TTS de Google Translate | `src/lib/speak.ts` y `netlify/functions/tts.ts` (piden `translate.google.com/translate_tts` en tiempo de ejecución) | Google | Por confirmar | El audio no está en el repo. `src/lib/speak.ts` también referencia los proxies `corsproxy.io` y `api.allorigins.win` |
| Fuentes Figtree, Fraunces y Frank Ruhl Libre | `index.source.html` (también `index.html`, `404.html` y copias en `docs/`); nombres en `src/index.css` | Google Fonts (`fonts.googleapis.com`) | Por confirmar | No hay archivos de fuente en el repo |
| Ilustraciones de la Mora Maggie, diplomas e iconos | `images/maggie/`, `images/diplomas/` (copias en `public/` y `docs/`), `src/assets/hero.png`, `icons/`, `favicon.svg` | Por confirmar. `scripts/generate-diplomas.py` describe los diplomas como «AI/arte Maggie» | Por confirmar | Sin metadatos de licencia en el repo |
| Textos o vocabulario de terceros (si los hay) | `src/data/` (`alphabet.ts`, `vocabulary.ts`, `grammar.ts`, `phrases.ts`, `lessons.ts`, `zionism.ts`, `calendar.ts`) | Por confirmar | Por confirmar | No hay un corpus aparte de textos tradicionales; no se verificó el titular frase por frase |
| Dependencias de software y assets generados (p. ej. Workbox) | `package.json`, `package-lock.json`; bundles en `assets/`, `workbox-9c191d2f.js`, `sw.js` (copias en `docs/`) | Cada paquete | La de cada paquete | Ver lockfile |

## Categorías a revisar

- **Textos tradicionales o de terceros** (p. ej. Torá, brajot, tefilot, citas, traducciones ajenas).
- **Datos** (APIs, datasets, tablas oficiales).
- **Audio** (música, grabaciones de personas, tropos/melodías).
- **Imágenes e ilustraciones** (de terceros, stock o generadas por IA con términos del proveedor).
- **Fuentes tipográficas e íconos.**
- **Marcas y logotipos** de terceros: se usan solo como referencia y no se licencian.
- **Dependencias de software:** ver `package.json` / lockfile. Cada paquete conserva su propia licencia.

Si eres titular de algún material incluido y quieres que se corrija la atribución o se retire, escribe a través de https://aqabank.cl.
