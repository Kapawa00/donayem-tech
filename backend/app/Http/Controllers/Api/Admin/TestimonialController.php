<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesFileUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Http\Resources\Admin\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class TestimonialController extends Controller
{
    use HandlesFileUploads;

    public function index(): JsonResponse
    {
        $testimonials = Testimonial::query()->latest()->paginate(15);

        return TestimonialResource::collection($testimonials)->response();
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return (new TestimonialResource($testimonial))->response();
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('client_photo')) {
                $data['client_photo'] = $this->storeUploadedImage($request->file('client_photo'), 'testimonials');
            }

            $testimonial = Testimonial::create($data);

            return (new TestimonialResource($testimonial))->response()->setStatusCode(201);
        } catch (Throwable $e) {
            Log::error('Admin\TestimonialController::store a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => 'Impossible de créer le témoignage.'], 500);
        }
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('client_photo')) {
                $this->deleteStoredFile($testimonial->client_photo);
                $data['client_photo'] = $this->storeUploadedImage($request->file('client_photo'), 'testimonials');
            }

            $testimonial->update($data);

            return (new TestimonialResource($testimonial))->response();
        } catch (Throwable $e) {
            Log::error('Admin\TestimonialController::update a échoué.', [
                'testimonial_id' => $testimonial->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de mettre à jour le témoignage.'], 500);
        }
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        try {
            $this->deleteStoredFile($testimonial->client_photo);
            $testimonial->delete();

            return response()->json(['message' => 'Témoignage supprimé.']);
        } catch (Throwable $e) {
            Log::error('Admin\TestimonialController::destroy a échoué.', [
                'testimonial_id' => $testimonial->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de supprimer le témoignage.'], 500);
        }
    }
}
