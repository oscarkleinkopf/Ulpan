# Ulpan Hibrit

App web para aprender **hebreo desde cero**, pensada para computadores y móviles. Interfaz en español.

## Qué incluye

- **Lecciones** guiadas (alefato, vocabulario, gramática, frases)
- **Alefato** completo con formas finales y vocales (nikud)
- **Gramática** básica para hispanohablantes
- **Frases útiles** por situación
- **Práctica** con repetición espaciada (SRS) y progreso en el dispositivo
- Pronunciación vía Web Speech API cuando el navegador la soporte

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Despliegue en Netlify (`netlify.toml` + plugin de Vite). El progreso se guarda en `localStorage`.
