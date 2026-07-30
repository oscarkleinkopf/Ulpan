# Ulpan Hibrit

App web para aprender **hebreo desde cero**, pensada para computadores y móviles. Interfaz en español.

## Qué incluye

- **Lecciones** guiadas (alefato, vocabulario, gramática, frases)
- **Alefato** completo con formas finales y vocales (nikud)
- **Vocabulario** buscable por temas
- **Sionismo**: sección especial de términos históricos y culturales, más el **calendario sionista** (Shoá, Zikarón, Atzmaút…)
- **Gramática** básica para hispanohablantes
- **Frases útiles** por situación
- **Práctica** SRS + quizzes rápidos
- **Progreso** local (racha, XP, preferencia de género gramatical)
- Pronunciación vía Web Speech API cuando el navegador la soporte
- Manifest PWA para instalar en el móvil

## Transliteración

Para hispanohablantes, **ח** y **כ** suave se escriben con **j** (nunca *ch*): *slijá*, *jaláv*, *ajót*.

## Sitio (GitHub Pages)

URL: https://oscarkleinkopf.github.io/Ulpan/

**Configuración en GitHub** (Settings → Pages):

1. Source: **Deploy from a branch**
2. Branch: **`main`**
3. Folder: **`/docs`** ← importante (no `/ root`)
4. Save

La carpeta `docs/` contiene la app ya compilada.

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

Para previsualizar como en GitHub Pages:

```bash
GITHUB_PAGES=true npm run build
npx vite preview
```

También se puede desplegar en Netlify (`netlify.toml` + plugin de Vite). El progreso se guarda en `localStorage`.
