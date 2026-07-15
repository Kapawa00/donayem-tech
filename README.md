# DONAYEM TECH — Site vitrine, devis & paiement en ligne

Site vitrine + API pour DONAYEM TECH, agence digitale basée à Douala (Cameroun), spécialisée en
webdesign, infographie, marketing digital, formation bureautique et boutiques Shopify. Le projet
permet de présenter les services de l'agence, de recevoir des demandes de devis, et d'encaisser des
paiements en ligne (Orange Money, MTN MoMo, carte bancaire) via CinetPay.

## Stack technique

| Couche | Techno | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 14.2.x |
| Styles | Tailwind CSS | 3.4.x |
| Animations | Framer Motion | 11.x |
| Icônes | Lucide React | latest |
| Forms | React Hook Form | 7.x |
| Éditeur Markdown (admin blog) | @uiw/react-md-editor | latest |
| HTTP client | Axios | 1.7.x |
| Backend | Laravel | 11.x |
| Base de données | MySQL | 8.x |
| Auth API | Laravel Sanctum (tokens Bearer) | 4.x |
| Upload médias | Spatie Media Library | 11.x |
| Redimensionnement images | Intervention Image | 3.x |
| Emails | Laravel Mail + SMTP | — |
| Paiement | CinetPay API | — |
| Déploiement frontend | Vercel | — |
| Déploiement backend | Railway / Render | — |

## Architecture des dossiers

Deux workspaces indépendants — ne jamais mélanger dépendances Node et PHP dans un même dossier :

```
Donayem_TECH/
├── frontend/                    Next.js App Router
│   ├── app/
│   │   ├── (public)/            Pages publiques (home, services, portfolio, blog, devis, paiement,
│   │   │                        contact, à-propos) — layout dédié avec Navbar/Footer/WhatsApp
│   │   ├── admin/                Panel d'administration (SPA Next.js, pas de Filament)
│   │   ├── not-found.jsx         Page 404
│   │   ├── error.jsx             Erreur globale
│   │   └── loading.jsx           Loader global (Suspense)
│   ├── components/
│   │   ├── ui/                  Composants génériques (Button, Card, Input, Modal, DataTable…)
│   │   ├── sections/             Sections de page réutilisables (Hero, CtaSection, StatsSection…)
│   │   ├── forms/                Formulaires publics (ContactForm, DevisForm, QuickQuoteForm)
│   │   ├── admin/                Composants du panel admin
│   │   └── analytics/            GoogleAnalytics, FacebookPixel (chargés via CookieBanner)
│   ├── lib/                      Client API (api.js/adminAuth.js), analytics.js, animations.js, seo.js
│   ├── data/                     Données statiques (services, portfolio, catégories blog…)
│   ├── contexts/                 AdminAuthContext (session admin)
│   └── middleware.js             Protection des routes /admin/*
│
└── backend/                      API Laravel
    ├── app/
    │   ├── Http/Controllers/Api/         Controllers publics
    │   ├── Http/Controllers/Api/Admin/   Controllers admin (Sanctum + rôle admin/superadmin)
    │   ├── Http/Requests/                 Validation (Form Requests)
    │   ├── Models/                        User, Service, PortfolioItem, BlogPost, Quote, Order,
    │   │                                  Payment, Setting, ContactMessage, Testimonial
    │   ├── Services/CinetPayService.php   Intégration API CinetPay
    │   └── Mail/                          Mailables (confirmation devis, paiement…)
    ├── database/migrations/, seeders/
    ├── routes/api.php                     Toutes les routes API (préfixe /api)
    └── resources/views/emails/            Templates d'email Blade
```

## Installation locale

### Prérequis

- Node.js 18+ et npm
- PHP 8.2+ et Composer
- MySQL 8.x

### Backend (`/backend`)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configurer `DB_*` dans `.env` (voir [Variables d'environnement](#variables-denvironnement)), puis :

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

L'API tourne sur `http://localhost:8000`. Le seeder `AdminUserSeeder` crée un compte admin par
défaut (`admin@donayemtech.com` / `changeme123`) — **à changer immédiatement**, y compris en local
si la base est partagée.

### Frontend (`/frontend`)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Le site tourne sur `http://localhost:3000`. Les deux serveurs doivent tourner en parallèle pour
développer une fonctionnalité de bout en bout.

### Commandes utiles

```bash
# Frontend
npm run dev      # serveur de dev
npm run build    # build de production
npm run lint      # ESLint

# Backend
php artisan test                    # suite PHPUnit (tests/Unit + tests/Feature)
php artisan migrate:fresh --seed    # reset DB + seeders
vendor/bin/pint                     # formatage du code (Laravel Pint)
```

## Variables d'environnement

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL de base de l'API (`http://localhost:8000/api` en dev) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro WhatsApp affiché sur le bouton flottant |
| `NEXT_PUBLIC_CINETPAY_SITE_ID` | Site ID CinetPay (front, informatif) |
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics 4 (`G-XXXXXXXXXX`) — laisser vide pour désactiver |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | ID Facebook Pixel — laisser vide pour désactiver |

Analytics et Pixel ne se chargent que si l'utilisateur accepte les cookies (bandeau RGPD, préférence
stockée en `localStorage`).

### Backend (`backend/.env`)

Variables clés (voir `backend/.env.example` pour la liste complète) :

| Variable | Description |
|---|---|
| `APP_URL` / `FRONTEND_URL` | URLs backend/frontend — doivent être cohérentes entre elles et avec `SANCTUM_STATEFUL_DOMAINS` |
| `DB_*` | Connexion MySQL |
| `MAIL_*` | SMTP pour les emails transactionnels |
| `CINETPAY_SITE_ID`, `CINETPAY_API_KEY` | Identifiants CinetPay — **c'est ici, pas dans la table `settings`, que l'intégration de paiement lit ses identifiants réels** |
| `CINETPAY_NOTIFY_URL`, `CINETPAY_RETURN_URL`, `CINETPAY_CANCEL_URL` | Dérivées de `APP_URL`/`FRONTEND_URL` |
| `SANCTUM_STATEFUL_DOMAINS` | Domaine frontend autorisé pour l'auth Sanctum |

Ne jamais committer de vraies valeurs pour `CINETPAY_API_KEY`, `DB_PASSWORD`, `MAIL_PASSWORD`, etc.

## Paiement — CinetPay

Flux : devis accepté → `Order` (pending) → `/paiement/{orderId}` → choix méthode (Orange Money, MTN
MoMo, carte) → `POST /api/payments/initiate` → redirection CinetPay → paiement client → webhook
CinetPay → **revérification systématique du statut via l'API CinetPay** (jamais de confiance
aveugle au webhook) → `Order.status = paid` → email de confirmation.

## Déploiement

- **Frontend → Vercel** : `frontend/vercel.json` définit les rewrites `/api/*` et les headers de
  sécurité. Variables d'environnement à configurer dans Vercel (jamais commit un `.env.production`
  réel — voir `frontend/.env.production.example` pour le gabarit).
- **Backend → Railway/Render** : `backend/Procfile` et `backend/deploy.sh` (migrations, cache config/
  route/view, `storage:link`). Pour un VPS, voir `backend/.htaccess` (Apache) ou `backend/nginx.conf`
  (snippet nginx).
- **Checklist de lancement** : voir `CHECKLIST_LANCEMENT.md` à la racine — à valider intégralement
  avant mise en production (SSL, credentials CinetPay de prod, tests de paiement réels, SEO, backups,
  etc.).

## Contacts de maintenance

DONAYEM TECH — Douala, Ange Raphaël (Hôtel Sélect), Cameroun

- Téléphone : 681 181 456 / 696 580 487
- Email : contact@donayemtech.com
