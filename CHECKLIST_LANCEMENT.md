# Checklist de lancement — DONAYEM TECH

À valider intégralement avant d'annoncer la mise en production. Cocher au fur et à mesure ;
ne pas lancer tant qu'un point de la section **Paiement** ou **Sécurité** n'est pas validé.

## Infrastructure & domaine

- [ ] Domaine configuré + SSL actif (frontend `donayemtech.com` sur Vercel, API
      `api.donayemtech.com` sur Railway/Render — SSL géré automatiquement par les deux
      plateformes, vérifier que le certificat est bien émis avant d'ouvrir le DNS au public)
- [ ] Variables d'environnement production configurées
      - Vercel : `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
        `NEXT_PUBLIC_CINETPAY_SITE_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
        (voir `frontend/.env.production.example`)
      - Railway : toutes les clés de `backend/.env.example`, en particulier `APP_ENV=production`,
        `APP_DEBUG=false`, `APP_KEY` généré en prod (`php artisan key:generate`), `DB_*`,
        `MAIL_*`, `CINETPAY_*`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`
- [ ] CinetPay : `site_id` et `api_key` de production (pas sandbox) renseignés dans les
      variables d'environnement backend (`CINETPAY_SITE_ID`, `CINETPAY_API_KEY`), et
      `CINETPAY_NOTIFY_URL`/`RETURN_URL`/`CANCEL_URL` pointent bien vers les domaines de prod
      (dérivés de `APP_URL`/`FRONTEND_URL` — vérifier que ces deux valeurs sont correctes)

## Backend

- [ ] Email SMTP configuré et testé (`MAIL_*` en prod — ne pas laisser Mailtrap ; tester
      l'envoi réel de `PaymentConfirmation` après un paiement de test)
- [ ] Admin password changé (l'utilisateur `admin@donayemtech.com` créé par
      `AdminUserSeeder` a le mot de passe par défaut `changeme123` — le changer immédiatement
      après le premier déploiement, via `/admin` ou `php artisan tinker`)
- [ ] Backup DB automatique configuré (snapshot MySQL géré par l'hébergeur ou cron
      `mysqldump` — vérifier qu'un backup existe et qu'il est restaurable avant le lancement)
- [ ] Rate limiting vérifié (60 req/min sur les routes publiques, 5 req/min sur
      `/api/contact` et `/api/quotes` — défini dans `backend/routes/api.php`, confirmer en
      prod avec quelques requêtes rapides que le 429 se déclenche bien)
- [ ] CORS configuré pour le bon domaine de production (`backend/config/cors.php` lit
      `FRONTEND_URL` — vérifier que la variable pointe vers `https://donayemtech.com` et non
      `localhost:3000` avant le lancement)

## Paiement CinetPay (bout en bout, en conditions réelles)

- [ ] Test paiement Orange Money end-to-end (devis → commande → paiement → webhook →
      `Order.status = paid` → email de confirmation reçu)
- [ ] Test paiement MTN MoMo end-to-end
- [ ] Test paiement carte bancaire (Visa/MasterCard) end-to-end
- [ ] Vérifier que `PaymentController::webhook` revérifie bien le statut via l'API CinetPay
      avant de marquer une commande payée (déjà implémenté — ne pas régresser dessus lors
      d'un correctif de dernière minute)

## SEO & Analytics

- [ ] Google Analytics installé et vérifié (`NEXT_PUBLIC_GA_ID` renseigné, vérifier la
      réception d'événements en temps réel dans GA après une visite de test)
- [ ] Sitemap soumis à Google Search Console (`frontend/app/sitemap.js` génère
      `/sitemap.xml` dynamiquement — soumettre l'URL de prod une fois le domaine actif)
- [ ] Vérification robots.txt (`frontend/app/robots.js` — confirmer qu'il autorise bien
      l'indexation en production et n'exclut pas tout le site par erreur)
- [ ] Vérification meta tags sur toutes les pages clés (home, services, portfolio, blog,
      à-propos, contact, devis — `generateMetadata()`/`openGraph` par page, + JSON-LD
      `LocalBusiness` sur la home via `components/seo/LocalBusinessSchema.jsx`)
- [ ] Performance Lighthouse > 85 mobile (à lancer sur les pages home, services et un
      article de blog une fois déployé sur le domaine final — le CDN/edge de Vercel change
      les résultats par rapport à un test en local)

## Frontend / UX

- [ ] Test formulaire de contact (`/contact` → `POST /api/contact` → email/notification
      admin reçu)
- [ ] Test formulaire de devis (`/devis` → `POST /api/quotes` → devis visible dans
      `/admin/devis` avec la référence `DEVIS-YYYYMMDD-XXXX`)
- [ ] Test responsive sur iPhone + Android (au minimum : home, page service, formulaire de
      devis et flux de paiement — ce sont les parcours à plus fort enjeu commercial)

## Divers

- [ ] Vérifier que le token admin (localStorage + cookie `admin_token`, voir
      `frontend/lib/adminAuth.js`) fonctionne correctement sur le domaine de prod HTTPS
      (le cookie est posé en `SameSite=Lax`, pas de souci attendu en HTTPS same-site, mais à
      confirmer après déploiement)
