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
- **Cuenta en la nube** (Supabase): sincroniza progreso, perfiles y tareas entre dispositivos — también en GitHub Pages
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

### Cuenta en la nube (Supabase · GitHub Pages)

GitHub Pages solo sirve archivos estáticos, así que la sync usa **Supabase** (auth + Postgres) desde el navegador.

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta [`supabase/schema.sql`](supabase/schema.sql).
3. En **Authentication → URL configuration**, agrega la Redirect URL:
   `https://oscarkleinkopf.github.io/Ulpan/**`
4. Copia **Project URL** y **anon public** key (Settings → API).
5. En el repo de GitHub: **Settings → Secrets and variables → Actions** y crea:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Lanza el workflow **Build GitHub Pages** (o haz push a `main`).
7. En la app: **Cuenta** → crear cuenta → *Sincronizar ahora*.

Para desarrollo local, copia `.env.example` a `.env.local` con las mismas variables.

Sin Supabase configurado, todo sigue en `localStorage` de ese dispositivo.
