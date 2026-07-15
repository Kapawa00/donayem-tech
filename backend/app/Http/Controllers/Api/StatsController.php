<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HomeStatsService;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __construct(private readonly HomeStatsService $homeStats)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->homeStats->compute()]);
    }
}
