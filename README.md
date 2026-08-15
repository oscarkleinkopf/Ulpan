# Ulpan con la Mora Maggie

App web para aprender **hebreo desde cero**, pensada para computadores y móviles. Interfaz en español.

## Qué incluye

- **Hoy en el Ulpan**: inicio con 3 pasos (lección, repaso, tarea) + palabra del día; menú corto y el resto en **Más**
- **Lecciones** guiadas (alefato, vocabulario, gramática, frases)
- **Alefato** completo con formas finales y vocales (nikud)
- **Vocabulario** buscable por temas
- **Sionismo**: sección especial de términos históricos y culturales, más el **calendario sionista** (Shoá, Zikarón, Atzmaút…)
- **Gramática** básica para hispanohablantes
- **Frases útiles** por situación
- **Práctica** SRS + quizzes rápidos
- **Perfiles** de morim (mora/more) y talmidim (talmid/talmidá)
- **Tareas semanales** con corrección de la mora (visto bueno, “para corregir” y comentarios)
- **Audio guiado** (escuchá y repetí) con TTS de respaldo
- **Estudio de audio** para la Mora: grabar/subir voz cuando activa el permiso en su cuenta
- **Resumen de clase** semanal (avance, visto bueno, copiar a WhatsApp)
- **Calendario en casa**: foco cultural del día + palabra
- **Modo pareja**: diálogos cortos por turnos
- **Entrega semanal**: pack de 5 palabras + 3 frases (WhatsApp / imprimir)
- **Certificados** livianos por unidad o racha (arte diploma con Maggie + CSV para Canva Bulk Create en `docs/canva/`)
- **Cuenta en la nube** (Supabase): sincroniza progreso, perfiles y tareas entre dispositivos — también en GitHub Pages
- **Progreso** local (racha, XP, preferencia de género gramatical); con sesión, también en la nube
- Pronunciación: voz de la Mora si hay clip; si no, TTS / Web Speech
- Manifest PWA para instalar en el móvil (banner “Instalá Ulpan Maggie”; en iOS: Compartir → Agregar a pantalla de inicio)

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

### Audio guiado + grabación de la Mora

1. Volvé a ejecutar [`supabase/schema.sql`](supabase/schema.sql) (agrega tabla `guided_audio`, bucket `guided-audio` y políticas).
2. En **Cuenta**, al crear o editar rol **Morá / Moré**, marcá **Puedo grabar audio guiado**.
3. Abrí **Estudio** (`/estudio-audio`) y grabá o subí clips asociados a frases, vocabulario o letras.
4. Los alumnos practican en **Audio** (`/audio-guiado`) y en pasos “escuchá y repetí” de las lecciones.
5. Si no hay grabación, el botón ▶ usa TTS de respaldo.

### Login con Google

1. En [Google Cloud Console](https://console.cloud.google.com/) crea un proyecto (o usa uno) → **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Tipo: **Web application**.
3. **Authorized JavaScript origins:**
   - `https://qzietzvybqlscgsbiazr.supabase.co`
   - `https://oscarkleinkopf.github.io`
4. **Authorized redirect URIs:**
   - `https://qzietzvybqlscgsbiazr.supabase.co/auth/v1/callback`
5. Copia **Client ID** y **Client Secret**.
6. En Supabase → **Authentication → Sign In / Providers → Google** → Enable → pega Client ID y Secret → Save.
7. En la app: **Cuenta → Continuar con Google**.
