<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderFormationsRequest;
use App\Http\Requests\StoreFormationRequest;
use App\Http\Requests\UpdateFormationRequest;
use App\Http\Resources\FormationResource;
use App\Models\Formation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class FormationController extends Controller
{
    private const CACHE_KEYS = ['formations.active.all', 'formations.active.module', 'formations.active.academic_service'];

    public function index(): JsonResponse
    {
        $formations = Formation::query()->orderBy('order')->get();

        return FormationResource::collection($formations)->response();
    }

    public function show(Formation $formation): JsonResponse
    {
        return (new FormationResource($formation))->response();
    }

    public function store(StoreFormationRequest $request): JsonResponse
    {
        try {
            $formation = Formation::create($request->validated());
            $this->forgetCache();

            return (new FormationResource($formation))->response()->setStatusCode(201);
        } catch (Throwable $e) {
            Log::error('Admin\FormationController::store a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => 'Impossible de créer la formation.'], 500);
        }
    }

    public function update(UpdateFormationRequest $request, Formation $formation): JsonResponse
    {
        try {
            $formation->update($request->validated());
            $this->forgetCache();

            return (new FormationResource($formation))->response();
        } catch (Throwable $e) {
            Log::error('Admin\FormationController::update a échoué.', [
                'formation_id' => $formation->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de mettre à jour la formation.'], 500);
        }
    }

    public function destroy(Formation $formation): JsonResponse
    {
        try {
            $formation->delete();
            $this->forgetCache();

            return response()->json(['message' => 'Formation supprimée.']);
        } catch (Throwable $e) {
            Log::error('Admin\FormationController::destroy a échoué.', [
                'formation_id' => $formation->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de supprimer la formation.'], 500);
        }
    }

    public function reorder(ReorderFormationsRequest $request): JsonResponse
    {
        try {
            DB::transaction(function () use ($request) {
                foreach ($request->validated('ids') as $index => $id) {
                    Formation::whereKey($id)->update(['order' => $index]);
                }
            });

            $this->forgetCache();

            return response()->json(['message' => 'Ordre des formations mis à jour.']);
        } catch (Throwable $e) {
            Log::error('Admin\FormationController::reorder a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => 'Impossible de réordonner les formations.'], 500);
        }
    }

    private function forgetCache(): void
    {
        foreach (self::CACHE_KEYS as $key) {
            Cache::forget($key);
        }
    }
}
