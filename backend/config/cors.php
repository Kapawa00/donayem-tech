<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Autorise le frontend Next.js (FRONTEND_URL) à consommer l'API DONAYEM
    | TECH, y compris pour les requêtes authentifiées via Sanctum.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    | FRONTEND_URL ne couvre qu'une seule origine (ex: https://donayemtech.com).
    | On dérive automatiquement la variante www./non-www. pour éviter les 403 CORS
    | quand le site est servi sous les deux formes (cas DONAYEM TECH en prod).
    */
    'allowed_origins' => (function () {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $origins = [$frontendUrl];

        $parts = parse_url($frontendUrl);
        if (isset($parts['host'])) {
            $altHost = str_starts_with($parts['host'], 'www.')
                ? substr($parts['host'], 4)
                : 'www.'.$parts['host'];

            $altUrl = $parts['scheme'].'://'.$altHost;
            if (isset($parts['port'])) {
                $altUrl .= ':'.$parts['port'];
            }

            $origins[] = $altUrl;
        }

        return $origins;
    })(),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    'supports_credentials' => true,

];
