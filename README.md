# Ulpan con la Mora Maggie

App web para aprender **hebreo desde cero**, pensada para computadores y móviles. Interfaz en español.

## Qué incluye

- **Lecciones** guiadas (alefato, vocabulario, gramática, frases)
- **Alefato** completo con formas finales y vocales (nikud)
- **Vocabulario** buscable por temas
- **Sionismo**: sección especial de términos históricos y culturales, más el **calendario sionista** (Shoá, Zikarón, Atzmaút…)
- **Gramática** básica para hispanohablantes
- **Frases útiles** por situación
- **Práctica** SRS + quizzes rápidos
- **Perfiles** de morim (mora/more) y talmidim (talmid/talmidá)
- **Tareas semanales** asignadas por la mora a cada alumno o a toda la clase
- **Cuenta en la nube** (Netlify Identity + Database): sincroniza progreso, perfiles y tareas entre dispositivos
- **Progreso** local (racha, XP, preferencia de género gramatical); con sesión, también en la nube
- Pronunciación vía Web Speech API cuando el navegador la soporte
- Manifest PWA para instalar en el móvil

## Transliteración

Para hispanohablantes, **ח** y **כ** suave se escriben con **j** (nunca *ch*): *slijá*, *jaláv*, *ajót*.

## Sitio (GitHub Pages)

URL: https://oscarkleinkopf.github.io/Ulpan/

**Settings → Pages** (dejar así, sin carpetas raras):

1. Source: **Deploy from a branch**
2. Branch: **`main`**
3. Folder: **`/ (root)`**
4. Save

No hace falta elegir `gh-pages` ni `/docs`.

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

También se puede desplegar en Netlify (`netlify.toml` + plugin de Vite).

### Cuenta en la nube (Netlify)

1. Despliega el sitio en Netlify (la base de datos se provisiona al detectar `@netlify/database`).
2. Activa **Identity** en Project configuration → Identity (registro abierto).
3. En la app: **Cuenta** → crear cuenta / iniciar sesión → *Sincronizar ahora*.

Sin Identity o fuera de Netlify, todo sigue funcionando en `localStorage` de ese dispositivo.
