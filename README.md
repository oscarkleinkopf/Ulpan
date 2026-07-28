# Ulpan Hibrit

App web para aprender **hebreo desde cero**, pensada para computadores y móviles. Interfaz en español.

## Qué incluye

- **Lecciones** guiadas (alefato, vocabulario, gramática, frases)
- **Alefato** completo con formas finales y vocales (nikud)
- **Vocabulario** buscable por temas
- **Sionismo**: sección especial de términos históricos y culturales
- **Gramática** básica para hispanohablantes
- **Frases útiles** por situación
- **Práctica** SRS + quizzes rápidos
- **Progreso** local (racha, XP, preferencia de género gramatical)
- Pronunciación vía Web Speech API cuando el navegador la soporte
- Manifest PWA para instalar en el móvil

## Transliteración

Para hispanohablantes, **ח** y **כ** suave se escriben con **j** (nunca *ch*): *slijá*, *jaláv*, *ajót*.

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
