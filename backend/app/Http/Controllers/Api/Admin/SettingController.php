<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->groupedSettings()]);
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        try {
            foreach ($request->validated('settings') as $key => $value) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }

            return response()->json([
                'message' => 'Paramètres mis à jour.',
                'data' => $this->groupedSettings(),
            ]);
        } catch (Throwable $e) {
            Log::error('Admin\SettingController::update a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => 'Impossible de mettre à jour les paramètres.'], 500);
        }
    }

    private function groupedSettings(): Collection
    {
        return Setting::all()
            ->groupBy(fn (Setting $setting) => $setting->group ?? 'general')
            ->map(fn ($group) => $group->pluck('value', 'key'));
    }
}
