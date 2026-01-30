# Intruct — Kompletna projektna dokumentacija

## 1) Ideja i opis proizvoda

Intruct je mobilna platforma za kreiranje personalizovanih kurseva uz pomoć AI. Korisnik može da priloži materijale (fajlovi/linovi), da pokrene generisanje plana i lekcija, da čuva kurs u svojoj biblioteci, i (u perspektivi) da objavi kurs u javni katalog. Aplikacija je fokusirana na jasne stanja (loading/empty/error), stabilan data layer i doslednu theming logiku.

## 2) Visok nivo arhitekture

**Arhitektura proizvoda:**

```text
Mobile client (Expo/React Native)
        ↓
Go API (REST, Swagger/OpenAPI)
        ↓
Supabase (PostgreSQL + Storage)
        ↓
 n8n (AI workflows za generisanje kursa)
```

- Mobilna aplikacija inicira create-course, šalje materijale i metapodatke.
- Go API čuva zadatke u bazi i pokreće n8n workflow.
- n8n generiše strukturu, lekcije i kvizove, pa vraća rezultat u bazu.

## 3) Tehnološki stack

- **Mobile:** Expo React Native, TypeScript, Expo Router, Tamagui
- **Data layer:** `services/api.ts`, tipovi u `types/`, mock u `mockdata/`
- **Auth:** Supabase session (access_token) kao Bearer token
- **Backend:** Go, PostgreSQL, Swagger/OpenAPI, n8n workflow

### 3.1 Git repozitorijumi

- Frontend: [https://github.com/Intruct-Dev-Team/intruct-app](https://github.com/Intruct-Dev-Team/intruct-app)
- Backend: [https://github.com/Intruct-Dev-Team/intruct-backend](https://github.com/Intruct-Dev-Team/intruct-backend)

### 3.2 Korišćene biblioteke (ključne)

- **UI i theming:** `tamagui`, `@tamagui/config`, `@tamagui/portal`, `@tamagui/lucide-icons`
- **Navigacija:** `expo-router`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/elements`
- **Expo moduli:** `expo-document-picker`, `expo-haptics`, `expo-linking`, `expo-localization`, `expo-navigation-bar`, `expo-system-ui`, `expo-status-bar`, `expo-constants`
- **Mreža i storage:** `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `react-native-url-polyfill`
- **UX/performanse:** `react-native-gesture-handler`, `react-native-reanimated`, `react-native-screens`, `react-native-safe-area-context`
- **Sadržaj:** `react-native-markdown-display`, `katex`
- **Ostalo:** `@react-native-community/netinfo`, `react-native-webview`, `@react-native-google-signin/google-signin`

### 3.3 Procedura rada (skripte)

- `npm start` — pokretanje Expo dev servera
- `npm run android` — lokalni Android build (expo run:android)
- `npm run ios` — lokalni iOS build (expo run:ios)
- `npm run web` — web verzija preko Expo
- `npm run lint` — lint (expo lint)
- `npm run reset-project` — reset projekta (scripts/reset-project.js)

## 4) Arhitektura frontend aplikacije

Frontend je implementiran u Expo/React Native okruženju, sa file‑based routing preko Expo Router‑a, Tamagui UI slojem i centralizovanim data layer‑om. Arhitektura je usmerena na: jasne UI state‑ove, kontrolu tema, jedinstveni API sloj i strogo tipizovan model podataka.

### 4.1 Arhitekturni pregled i tok podataka

```text
Screens (app/)
   ↓
Components (components/)
   ↓
Contexts + Hooks (contexts/, hooks/)
   ↓
services/api.ts + types/
   ↓
Backend (Go API) → Supabase + n8n
```

Ključna pravila:

- UI koristi Tamagui komponente i tematske tokene.
- Poslovna logika se drži u context‑ima i hook‑ovima.
- Svi backend pozivi idu kroz `services/api.ts`.

### 4.2 Expo Router i organizacija ekrana

- **File‑based routing** je u `app/`.
- Koriste se **route groups**: `(tabs)`, `(auth)`, `(onboarding)`.
- Root layout je u `app/_layout.tsx`.
- Tab layout u `app/(tabs)/_layout.tsx`.

**Primeri ekrana (trenutna struktura):**

- `app/(tabs)/index.tsx` — Home
- `app/(tabs)/courses.tsx` — My Courses
- `app/(tabs)/catalog.tsx` — Catalog
- `app/(tabs)/settings.tsx` — Settings
- `app/(auth)/welcome.tsx` — Welcome
- `app/(auth)/login.tsx` — Login
- `app/(auth)/register.tsx` — Register
- `app/(auth)/forgot-password.tsx` — Forgot Password
- `app/(onboarding)/complete-registration.tsx` — Complete Registration
- `app/create-course.tsx` — Create Course flow
- `app/settings/profile.tsx` — Profile
- `app/settings/billing.tsx` — Billing
- `app/settings/help-center.tsx` — Help Center
- `app/settings/contact-support.tsx` — Contact Support
- `app/course/[id].tsx` — Course details
- `app/course/lesson/[id].tsx` — Lesson details
- `app/no-internet.tsx`, `app/server-unavailable.tsx`

### 4.3 Provideri i globalna infrastruktura

Provideri su definisani u `app/_layout.tsx` i obrađuju globalne potrebe (tema, jezik, auth, notifikacije). Redosled je bitan:

1. `ThemeProvider` (tema)
2. `LanguageProvider` (jezik + i18n)
3. `SafeAreaProvider`
4. `NotificationsProvider`
5. `AuthProvider` (auth + routing gate)
6. `CourseGenerationProvider`

Unutar njih se renderuje `RootLayoutContent` koji obuhvata:

- `TamaguiProvider` + `Theme`
- `NavigationThemeProvider`
- `PortalProvider`
- `Stack` (Expo Router)
- `NotificationsHost` (UI toasts/alerts)
- `CreatingCourseModal` (globalni modal generisanja kursa)

### 4.4 Theme i UI pravila

- UI koristi **Tamagui** komponente i tokene.
- Nema hardcoded boja; koristi se `useThemeColors()`.
- Za biblioteke koje traže realan hex string koristi se `resolveThemeColor()`.
- Tamna/svetla tema su centralizovane u `constants/colors.ts`.

### 4.5 Data layer (API)

- Sve API pozive radi `services/api.ts`.
- UI ne poziva `fetch()` direktno.
- Tipovi su u `types/` i uvoze se kao `import type { ... } from "@/types"`.
- Auth pozivi zahtevaju `session?.access_token` kao Bearer token.
- Za auth endpointe nema „tihih” mockova — greške se prikazuju korisniku.

### 4.6 Error, offline i server‑unavailable tokovi

- Offline detekcija preko `@react-native-community/netinfo`.
- Ako nema mreže, korisnik se preusmerava na `/no-internet`.
- Ako backend nije dostupan, preusmeravanje na `/server-unavailable`.

### 4.7 Localization (struktura spremna, bez migracije stringova)

- `localization/i18n.ts` + `localization/translations.ts` su scaffold.
- `LanguageProvider` održava jezik i sinhronizuje sa i18n.
- UI još ne koristi `t()` u ekranima — predviđena je postepena migracija.
- Dostupni UI jezici (9): English, Srpski, 中文, हिन्दी, Русский, Deutsch, Español, Français, Português.

### 4.8 Organizacija komponenti

Komponente su podeljene po nameni: `cards/`, `layout/`, `settings/`, `user/`, `modals/`, `common/`, `ui/`, `create-course/`.

To omogućava:

- lakšu navigaciju i skaliranje
- clear naming i barrel exports

### 4.9 Kursevi: javni i lični

- Model `Course` podržava `isPublic` i `isMine`/`isInMine` za razlikovanje javnog kataloga i lične biblioteke.
- Javne kartice mogu prikazivati `rating` i `ratingsCount` kada su dostupni.

### 4.10 Katalog: pretraga i sortiranje

- Katalog ekran ima pretragu po tekstu i sortiranje (`popular`, `rating`, `newest`).
- Sortiranje podržava smer (`asc`/`desc`).

### 4.11 Glavni ekrani aplikacije

- **(auth)**: Welcome, Login, Register, Forgot Password.
- **(onboarding)**: Complete Registration.
- **(tabs)**: Home, Courses, Catalog, Settings.
- **Course**: detalji kursa (`/course/[id]`) i lekcija (`/course/lesson/[id]`).
- **Settings pod‑stranice**: Profile, Billing, Help Center, Contact Support.
- **Stanja**: No Internet, Server Unavailable.

## 5) Struktura repozitorijuma (glavni delovi)

```text
app/            # Expo Router ekrani i layout-i
components/     # Reusable UI komponente (Tamagui)
contexts/       # React context provideri
services/       # Data layer (API)
types/          # Tipovi (TS)
hooks/          # Custom hooks
utils/          # Pomoćne util funkcije
docs/           # Dokumentacija
```

## 6) Create Course (flow)

Flow je definisan u `app/create-course.tsx` i koristi wizard korake:

1. **Attach Materials** — upload fajlova/linova
2. **Course Details** — naslov i opis
3. **Review & Create** — rezime i kreiranje

Tok uključuje `creating-course-modal.tsx` koji prikazuje progres:

- Processing materials
- Creating course plan
- Writing lessons

## 7) Onboarding: Complete Registration

- Ako backend vrati grešku „registration was not completed”, aplikacija preusmerava na `/ (onboarding) /complete-registration`.
- Forma uključuje ime, prezime i datum rođenja, i opcionalno avatar.
- U mock režimu profil se čuva lokalno u AsyncStorage.

## 8) Backend (Go API) — detaljnije

### 8.1 Funkcionalnosti

- Registracija i autentifikacija (JWT)
- Upravljanje kursevima, modulima i lekcijama
- Kvizovi (MCQ) i scoring
- Praćenje napretka (progress, streaks)
- Ocene/feedback
- Višejeznična podrška sadržaja kursa
- Integracija sa Supabase Storage (mediji/avatari)
- Integracija sa n8n (AI workflow)

### 8.2 Tech stack

- Go 1.24+
- chi v5 (router)
- sqlx + squirrel (DB access)
- PostgreSQL 15+
- Swagger/OpenAPI
- Docker + Nginx
- Supabase Storage (ili S3/MinIO)
- n8n

### 8.3 Arhitektura slojeva

```text
Transport Layer (HTTP handlers)
   ↓
Service Layer (business logic)
   ↓
Repository Layer (data access)
   ↓
Database (PostgreSQL/Supabase)
```

### 8.4 Struktura backend projekta

```text
cmd/
internal/ (application, config, entities, services, repository, transport)
pkg/
migrations/
_docs/
Dockerfile, docker-compose.yaml
```

### 8.5 Pokretanje (Docker)

1. `git clone https://github.com/Intruct-Dev-Team/intruct-backend.git`
2. kreiraj `.env` na osnovu `.env.example`
3. `docker-compose up -d --build`
4. Za stop: `docker-compose down`

### 8.6 API dokumentacija (Swagger)

- Deployed: [https://intruct.com/swagger/index.html#/](https://intruct.com/swagger/index.html#/)
- Lokalno: [http://localhost/swagger/index.html](http://localhost/swagger/index.html)

### 8.7 Environment promenljive (izdvojeno)

| Variable               | Opis                      | Required                 | Default           |
| ---------------------- | ------------------------- | ------------------------ | ----------------- |
| `SERVER_PORT`          | HTTP port backend-a       | Yes                      | `8080`            |
| `MIGRATIONS_PATH`      | Putanja do SQL migracija  | No                       | `migrations`      |
| `POSTGRES_HOST`        | PostgreSQL host           | Yes                      | example           |
| `POSTGRES_PORT`        | PostgreSQL port           | Yes                      | `5432`            |
| `POSTGRES_DB`          | DB name                   | Yes                      | `postgres`        |
| `POSTGRES_USER`        | DB user                   | Yes                      | -                 |
| `POSTGRES_PASSWORD`    | DB password               | Yes                      | -                 |
| `POSTGRES_SSLMODE`     | SSL mode                  | No                       | `require`         |
| `IS_INIT_DB`           | Migracije na startu       | Yes                      | `true/false`      |
| `JWT_SECRET_KEY`       | JWT signing key           | Yes                      | -                 |
| `SUPABASE_HOST`        | Supabase host             | Yes                      | -                 |
| `SUPABASE_USE_SSL`     | SSL za storage            | No                       | `true`            |
| `SUPABASE_SERVICE_KEY` | Supabase service key      | Yes                      | -                 |
| `SUPABASE_BUCKET`      | Storage bucket            | Yes                      | `avatars`         |
| `N8N_API_INTERNAL`     | Internal URL za n8n       | Yes (kad se koristi n8n) | `http://n8n:5678` |
| `SUPABASE_URL`         | Supabase URL (make token) | No                       | -                 |
| `SUPABASE_ANON_KEY`    | Supabase anon key         | No                       | -                 |
| `SUPABASE_EMAIL`       | Test email                | No                       | -                 |
| `SUPABASE_PASSWORD`    | Test password             | No                       | -                 |

## 9) n8n workflow (AI Course Generator)

Workflow radi sledeće:

- prima fajl preko Webhook-a
- ekstraktuje tekst (PDF/TXT)
- računa strategiju (broj lekcija/modula)
- generiše strukturu kursa (LLM)
- iterativno generiše lekcije i kvizove
- agregira rezultat i šalje nazad u bazu

Tehnologije: n8n, JavaScript (Node.js), AI model GLM‑4.7.

## 10) Pokretanje projekta (lokalno)

1. Instalacija:
   - `npm install`
2. Start:
   - `npm start`
3. Platforma:
   - `i` (iOS), `a` (Android), `w` (web)

Za iOS lokalni build je potreban Xcode; alternativno koristiti EAS Build.

## 11) Roadmap (fokus na virality)

Postojeće planirane inicijative:

- Deep links + share linkovi
- Public kurs i Open Graph
- Save from share
- Ratings/Reviews
- Remix

Više detalja u roadmap dokumentu.

---

Ako treba dodatak (API primeri, ER dijagrami, sequence dijagrami, detaljan opis ekrana i komponenti), navedite i mogu proširiti ovaj dokument.
