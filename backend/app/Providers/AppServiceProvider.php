<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // API-only backend: never redirect unauthenticated requests to a
        // "login" route (it doesn't exist), always fall through to a JSON 401.
        Authenticate::redirectUsing(fn () => null);
    }
}
