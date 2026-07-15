<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesFileUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderServicesRequest;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\Admin\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ServiceController extends Controller
{
    use HandlesFileUploads;

    public function index(): JsonResponse
    {
        $services = Service::query()->orderBy('order')->get();

        return ServiceResource::collection($services)->response();
    }

    public function show(Service $service): JsonResponse
    {
        return (new ServiceResource($service))->response();
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('cover_image')) {
                $data['cover_image'] = $this->storeUploadedImage($request->file('cover_image'), 'services');
            }

            $service = Service::create($data);
            Cache::forget('services.active');

            return (new ServiceResource($service))->response()->setStatusCode(201);
        } catch (Throwable $e) {
            Log::error('Admin\ServiceController::store a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => 'Impossible de créer le service.'], 500);
        }
    }

    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('cover_image')) {
                $this->deleteStoredFile($service->cover_image);
                $data['cover_image'] = $this->storeUploadedImage($request->file('cover_image'), 'services');
            }

            $service->update($data);
            Cache::forget('services.active');

            return (new ServiceResource($service))->response();
        } catch (Throwable $e) {
            Log::error('Admin\ServiceController::update a échoué.', [
                'service_id' => $service->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de mettre à jour le service.'], 500);
        }
    }

    public function destroy(Service $service): JsonResponse
    {
        try {
            $this->deleteStoredFile($service->cover_image);
            $service->delete();
            Cache::forget('services.active');

            return response()->json(['message' => 'Service supprimé.']);
        } catch (Throwable $e) {
            Log::error('Admin\ServiceController::destroy a échoué.', [
                'service_id' => $service->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de supprimer le service.'], 500);
        }
    }

    public function reorder(ReorderServicesRequest $request): JsonResponse
    {
        try {
            DB::transaction(function () use ($request) {
                foreach ($request->validated('ids') as $index => $id) {
                    Service::whereKey($id)->update(['order' => $index]);
                }
            });

            Cache::forget('services.active');

            return response()->json(['message' => 'Ordre des services mis à jour.']);
        } catch (Throwable $e) {
            Log::error('Admin\ServiceController::reorder a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => 'Impossible de réordonner les services.'], 500);
        }
    }
}
