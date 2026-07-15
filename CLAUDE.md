# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# DONAYEM TECH — Site vitrine + devis + paiement en ligne

Guide de référence pour Claude Code sur ce projet. Basé sur le cahier des charges v1.0 (juillet 2026).

## Contexte

DONAYEM TECH est une agence digitale à Douala (webdesign, infographie, marketing digital, formation
bureautique, boutiques Shopify). Le projet est un site vitrine Next.js + API Laravel permettant de
présenter les services, recevoir des demandes de devis, et encaisser des paiements (Orange Money, MTN
MoMo, carte bancaire) via CinetPay.

Contacts métier : 681 181 456 / 696 580 487 — contact@donayemtech.com

## Stack technique

| Couche | Techno | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 14.2.x |
| Styles | Tailwind CSS | 3.4.x |
| Animations | Framer Motion | 11.x |
| Icônes | Lucide React | latest |
| Forms | React Hook Form | 7.x |
| HTTP client | Axios | 1.7.x |
| Backend | Laravel | 11.x |
| DB | MySQL | 8.x |
| Auth API | Laravel Sanctum (token, pas cookie-session) | 4.x |
| Upload médias | Spatie Media Library | 11.x |
| Redim. images | Intervention Image | 3.x |
| Emails | Laravel Mail + SMTP/Mailtrap | — |
| Paiement | CinetPay API | — |
| Déploiement frontend | Vercel | — |
| Déploiement backend | Railway / Render | — |
| Storage | Cloudinary ou S3 | — |

## Commandes

Le repo est composé de deux workspaces indépendants — toujours lancer les commandes depuis le bon
dossier (`frontend/` ou `backend/`), jamais depuis la racine.

### Frontend (`/frontend`)

```bash
npm run dev      # serveur de dev Next.js (http://localhost:3000)
npm run build    # build de production
npm run start    # sert le build de production
npm run lint     # ESLint (config eslint-config-next)
```

Il n'y a pas de suite de tests côté frontend actuellement.

### Backend (`/backend`)

```bash
php artisan serve                 # serveur de dev (http://localhost:8000)
php artisan migrate               # applique les migrations
php artisan migrate:fresh --seed  # reset DB + seeders (services, portfolio, testimonials, settings, admin)
php artisan db:seed --class=AdminUserSeeder  # (re)crée l'utilisateur admin de dev

php artisan test                  # suite PHPUnit complète (tests/Unit + tests/Feature)
php artisan test --filter=NomDuTest   # un seul test
vendor/bin/pint                   # formatage du code (Laravel Pint)
```

Les deux serveurs doivent tourner en parallèle pour développer une fonctionnalité de bout en bout
(`frontend` sur :3000, `backend` sur :8000). `NEXT_PUBLIC_API_URL` (frontend) et `FRONTEND_URL` /
`SANCTUM_STATEFUL_DOMAINS` (backend `.env`) doivent pointer l'un vers l'autre.

## Architecture

### Frontend — routing

App Router avec deux groupes de routes distincts sous `app/` :

- `app/(public)/` — toutes les pages publiques (home, services, portfolio, blog, devis, paiement,
  contact, à-propos). Le groupe `(public)` a son propre `layout.jsx` (Navbar/Footer/WhatsAppButton).
- `app/admin/` — panneau d'administration (dashboard, services, portfolio, devis, paiements, blog,
  messages, settings), avec son propre `layout.jsx` (AdminSidebar/AdminHeader). `app/admin/login` est
  la seule route admin publique.

Pas de Filament ni d'admin Laravel côté serveur : l'admin est une SPA Next.js qui consomme l'API
Laravel via Sanctum tokens.

### Frontend — data & état

- `lib/api.js` — instance Axios partagée (publique + admin), injecte le Bearer token en localStorage
  via un interceptor, redirige vers `/admin/login` sur 401 si la route courante est `/admin/*`.
- `lib/adminAuth.js` — gestion du token admin. **Le token est dupliqué en localStorage ET en cookie** :
  localStorage pour l'interceptor Axios (client-side), cookie pour `middleware.js` qui tourne côté
  edge et ne peut pas lire le localStorage. Toujours garder les deux en synchro (`setToken`/
  `removeToken` le font déjà) si on touche à l'auth.
- `contexts/AdminAuthContext.jsx` — fournit `user`, `login`, `logout`, `isAuthenticated` à l'admin ;
  appelle `/auth/me` au montage pour valider le token existant.
- `middleware.js` — protège `/admin/*` (sauf `/admin/login`) en vérifiant la présence du cookie
  `admin_token` ; ne valide pas le token côté edge, seule sa présence (la validation réelle se fait
  via l'appel `/auth/me`).
- `lib/queries.js` — fonctions de fetch par ressource (services, portfolio, blog, etc.), utilisées par
  Server Components et pages admin.
- `data/*.js` — données statiques/fallback (services, portfolio, testimonials, FAQ) utilisées surtout
  pour le contenu qui n'est pas encore piloté par l'API ou pour le SEO statique.
- `lib/motion.js` / `lib/animations.js` — variants Framer Motion réutilisables (`fadeUp`,
  `staggerContainer`, `scaleIn`, `pageVariants`) : les redéfinir localement dans une page est à éviter.

### Backend — structure API

Toutes les routes vivent dans `routes/api.php`, préfixées `/api` via `bootstrap/app.php`
(`api: routes/api.php`). Deux groupes :

- Routes publiques (throttle 60/min, `/contact` et `/quotes` à 5/min) : services, portfolio,
  testimonials, blog, settings/public, contact, quotes, payments/initiate, payments/webhook,
  payments/{orderId}/status, auth/login.
- Routes admin (`Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])`) : CRUD services
  (+ reorder), portfolio (+ toggle-featured), blog (+ publish/unpublish), testimonials, quotes
  (update + create-order), payments (+ refund), messages, settings.

Le middleware `admin` (`app/Http/Middleware/AdminMiddleware.php`) vérifie `$request->user()->role`
∈ `[admin, superadmin]` — pas un guard Sanctum séparé, juste un check de rôle après `auth:sanctum`.

Controllers `Api/*` = publics, `Api/Admin/*` = protégés. Validation systématique via Form Requests
(`app/Http/Requests/`) — jamais de `validate()` inline dans un controller sauf cas déjà en place
(`PaymentController::initiate`, à ne pas prendre comme modèle pour de nouvelles routes). Réponses
sérialisées via API Resources (`app/Http/Resources/`) quand la ressource est exposée à l'admin ou au
public au-delà d'un simple CRUD brut.

### Modèle de données

Modèles : `User`, `Service`, `PortfolioItem`, `Testimonial`, `BlogPost`, `ContactMessage`, `Quote`,
`Order`, `Payment`, `Setting`. Schémas dans `database/migrations/` — s'y référer avant toute nouvelle
migration pour éviter les divergences de colonnes avec le cahier des charges (section 8).

Points d'attention :
- `Order::generateReference()` / la logique équivalente sur `Quote` génèrent `ORD-YYYYMMDD-XXXX` /
  `DEVIS-...` dans un hook `booted()` (`static::creating`) — toujours côté backend, jamais côté client.
- `services_requested`, `features`, `tags`, `cinetpay_data` sont des colonnes JSON castées.
- `orders.currency` et `payments.currency` : toujours `XAF`.
- Media (portfolio, blog, services) géré via Spatie Media Library (table `media`), pas de colonne
  `image_path` en dur sur les modèles concernés.

### Paiement — CinetPay

Flux : devis → `Order` (pending) → `/paiement/{orderId}` → choix méthode → `POST
/api/payments/initiate` → redirect URL CinetPay → paiement client → webhook `notify_url`
(`PaymentController::webhook`) → vérification via `CinetPayService::checkPaymentStatus()` → `Order.status
= paid` → email `PaymentConfirmation` → redirect `/paiement/confirmation`.

Logique dans `app/Services/CinetPayService.php` (appels à l'API CinetPay) et
`app/Http/Controllers/Api/PaymentController.php` (orchestration : `initiate`, `webhook`, `getStatus`).

Règles critiques :
- **Ne jamais faire confiance au webhook seul** : `webhook()` revérifie systématiquement la
  transaction via `CinetPayService::checkPaymentStatus()` avant de marquer un `Payment`/`Order`
  `paid` — c'est déjà implémenté, ne pas le contourner en cas de refactor.
- Canaux (`channels: 'ALL'`) couvrent Orange Money (`CM_ORANGEMONEY`), MTN MoMo
  (`CM_MTNMOBILEMONEY`), cartes Visa/MasterCard.
- Variables sensibles (`CINETPAY_API_KEY`, `CINETPAY_SITE_ID`) uniquement en `.env`, jamais commit.
  `CINETPAY_NOTIFY_URL`/`RETURN_URL`/`CANCEL_URL` sont dérivées de `APP_URL`/`FRONTEND_URL` dans
  `.env.example` — garder ces deux valeurs cohérentes entre front et back en dev.

## Design system

- **Couleurs** : `tailwind.config.js` définit déjà les échelles `navy` (50→950, `900` = `#050A22`
  deep bg, `500` = `#1A3490` medium) et `gold` (50→900, `400` = `#D4A336` accent CTA), plus
  `surface`/`border`/`muted`/`dark`. Ne pas introduire de nouvelle valeur de couleur ad hoc ailleurs
  dans le CSS/Tailwind — vérifier d'abord que l'échelle existante ne couvre pas déjà le besoin.
- **Typographie** : Syne (`font-syne`, display/titres, 600–800) + Inter (`font-inter`, body, 400–600),
  chargées via `next/font/google` dans `app/layout.jsx` (variables CSS `--font-syne`/`--font-inter`).
  Pas de `<link>` Google Fonts manuel.
- **Bordures** : `rounded-sm` 4px / `rounded-md` 8px / `rounded-lg` 16px / `rounded-pill` 9999px.
  Spacing base 8px.
- **Composants** : boutons `primary` (gold bg / navy text), `outline`, `ghost` (`components/ui/
  Button.jsx`) ; cards `bg-white border rounded-xl shadow-sm hover:shadow-md`.
- **Loader** : anneau double contra-rotatif navy/gold (`components/ui/Loader.jsx`, utilise
  l'animation `spin-reverse` du config Tailwind).
- **Animations Framer Motion** : variants réutilisables définis une fois (`fadeUp`,
  `staggerContainer`, `scaleIn`, `pageVariants`) et importés partout — ne pas les redéfinir page par
  page.

Ne pas dévier de cette palette / cette typo sans confirmation — c'est la charte graphique validée
par le client.

## API — conventions

- Routes publiques sous `/api/*`, routes admin sous `/api/admin/*` (voir Architecture ci-dessus).
- Rate limiting : 60 req/min routes publiques générales, 5 req/min sur `/api/contact` et
  `/api/quotes` (anti-spam) — déjà en place dans `routes/api.php`, à répliquer pour toute nouvelle
  route publique sensible au spam.
- Validation systématique via Form Requests Laravel — jamais de validation inline dans les
  controllers (sauf l'exception déjà notée dans `PaymentController::initiate`).

## Sécurité — règles non négociables

- Auth admin via Sanctum (tokens Bearer, pas de session cookie côté Laravel — voir la note sur le
  cookie `admin_token` ci-dessus qui sert uniquement au middleware Next.js, pas à l'API), CORS
  restreint au domaine frontend uniquement.
- Sanitisation de tous les inputs utilisateur (contact, devis) avant stockage/affichage.
- Upload : validation stricte du MIME type, taille max 5MB, renommage aléatoire du fichier stocké
  (voir `app/Http/Controllers/Concerns/HandlesFileUploads.php`).
- HTTPS obligatoire en production.
- Vérification de l'IP source sur le webhook CinetPay + re-validation API (voir section paiement).

## SEO & performance

- `generateMetadata()` dynamique par page, Open Graph complet (`app/opengraph-image.jsx`), JSON-LD
  `LocalBusiness`/`Service` (`components/seo/LocalBusinessSchema.jsx`).
- `next/image` partout pour les visuels, `next/font` pour Syne/Inter (pas de `<link>` Google Fonts
  manuel).
- Pagination API à 15 items/page (portfolio, blog).
- `app/sitemap.js` / `app/robots.js` génèrent sitemap et robots.txt dynamiquement — à mettre à jour
  si de nouvelles routes publiques indexables sont ajoutées.

## Conventions de travail

- Le cahier des charges définit 32 prompts de développement séquentiels (non repris ici en détail) —
  demander le prompt en cours si le contexte n'est pas clair plutôt que de deviner l'étape.
- Respecter le découpage `/frontend` et `/backend` : ne pas mélanger dépendances Node et PHP dans un
  même dossier. Le `package.json` à la racine de `/backend` (scripts Vite) est un reliquat du
  skeleton Laravel — ce n'est pas le frontend du projet, ignorer sauf tâche explicite sur les assets
  Laravel/Blade.
- Les couleurs, tailles de police et espacements du design system (section ci-dessus) sont la
  référence unique — ne pas introduire de nouvelles valeurs ad hoc dans le CSS/Tailwind config sans
  vérifier qu'elles n'existent pas déjà dans la palette.
