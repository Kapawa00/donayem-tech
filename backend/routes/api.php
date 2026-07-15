<?php

use App\Http\Controllers\Api\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\FormationController as AdminFormationController;
use App\Http\Controllers\Api\Admin\MessageController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\Admin\PortfolioController as AdminPortfolioController;
use App\Http\Controllers\Api\Admin\QuoteController as AdminQuoteController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes publiques
|--------------------------------------------------------------------------
|
| Toutes préfixées par /api (via bootstrap/app.php) et limitées à 60
| requêtes/minute par défaut. /contact et /quotes sont resserrées à
| 5 requêtes/minute pour limiter le spam.
|
*/
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{slug}', [ServiceController::class, 'show']);

    Route::get('/portfolio', [PortfolioController::class, 'index']);
    Route::get('/portfolio/categories', [PortfolioController::class, 'categories']);

    Route::get('/testimonials', [TestimonialController::class, 'index']);

    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blog/categories', [BlogController::class, 'categories']);
    Route::get('/blog/{slug}', [BlogController::class, 'show']);

    Route::get('/formations', [FormationController::class, 'index']);

    Route::get('/settings/public', [SettingController::class, 'public']);

    Route::get('/stats', [StatsController::class, 'index']);

    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');
    Route::post('/quotes', [QuoteController::class, 'store'])->middleware('throttle:5,1');

    Route::post('/payments/initiate', [PaymentController::class, 'initiate']);
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
    Route::get('/payments/{orderId}/status', [PaymentController::class, 'getStatus']);

    Route::post('/auth/login', [AuthController::class, 'login']);
});

Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Routes admin (Sanctum + rôle admin/superadmin)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::post('/services/reorder', [AdminServiceController::class, 'reorder']);
    Route::apiResource('services', AdminServiceController::class);

    Route::post('/portfolio/{portfolio}/toggle-featured', [AdminPortfolioController::class, 'toggleFeatured']);
    Route::apiResource('portfolio', AdminPortfolioController::class);

    Route::post('/blog/{blog}/publish', [AdminBlogController::class, 'publish']);
    Route::post('/blog/{blog}/unpublish', [AdminBlogController::class, 'unpublish']);
    Route::apiResource('blog', AdminBlogController::class);

    Route::apiResource('testimonials', AdminTestimonialController::class);

    Route::post('/formations/reorder', [AdminFormationController::class, 'reorder']);
    Route::apiResource('formations', AdminFormationController::class);

    Route::get('/quotes', [AdminQuoteController::class, 'index']);
    Route::get('/quotes/{quote}', [AdminQuoteController::class, 'show']);
    Route::put('/quotes/{quote}', [AdminQuoteController::class, 'update']);
    Route::post('/quotes/{quote}/create-order', [AdminQuoteController::class, 'createOrder']);

    Route::get('/payments', [AdminPaymentController::class, 'index']);
    Route::get('/payments/{payment}', [AdminPaymentController::class, 'show']);
    Route::post('/payments/{payment}/refund', [AdminPaymentController::class, 'refund']);

    Route::get('/messages', [MessageController::class, 'index']);

    Route::get('/settings', [AdminSettingController::class, 'index']);
    Route::put('/settings', [AdminSettingController::class, 'update']);
});
