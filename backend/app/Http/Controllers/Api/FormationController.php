<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormationResource;
use App\Models\Formation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FormationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'formations.active.'.($request->input('type') ?? 'all');

        $formations = Cache::remember($cacheKey, 3600, function () use ($request) {
            return Formation::query()
                ->where('is_active', true)
                ->when($request->filled('type'), fn ($query) => $query->where('type', $request->input('type')))
                ->orderBy('order')
                ->get();
        });

        return FormationResource::collection($formations)->response();
    }
}
