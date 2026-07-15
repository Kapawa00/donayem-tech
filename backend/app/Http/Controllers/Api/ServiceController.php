<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Cache::remember('services.active', 3600, function () {
            return Service::query()
                ->where('is_active', true)
                ->orderBy('order')
                ->select(['id', 'title', 'slug', 'category', 'short_description', 'long_description', 'icon', 'cover_image', 'features', 'starting_price', 'is_active', 'order'])
                ->get();
        });

        return ServiceResource::collection($services)->response();
    }

    public function show(string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return (new ServiceResource($service))->response();
    }
}
