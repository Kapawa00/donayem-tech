<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesFileUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Http\Resources\Admin\PortfolioResource;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PortfolioController extends Controller
{
    use HandlesFileUploads;

    public function index(Request $request): JsonResponse
    {
        $items = PortfolioItem::query()
            ->when($request->filled('category'), fn ($query) => $query->where('category', $request->input('category')))
            ->latest()
            ->paginate(12);

        return PortfolioResource::collection($items)->response();
    }

    public function show(PortfolioItem $portfolio): JsonResponse
    {
        return (new PortfolioResource($portfolio))->response();
    }

    public function store(StorePortfolioRequest $request): JsonResponse
    {
        try {
            $data = $request->safe()->except('media');
            $file = $request->file('media');
            $isImage = str_starts_with((string) $file->getMimeType(), 'image/');

            $data['media_type'] = $isImage ? 'image' : 'video';
            $data['media_url'] = $isImage
                ? $this->storeUploadedImage($file, 'portfolio')
                : $this->storeUploadedFile($file, 'portfolio');
            $data['thumbnail_url'] = $this->generateThumbnail($file, 'portfolio/thumbnails');

            $item = PortfolioItem::create($data);

            return (new PortfolioResource($item))->response()->setStatusCode(201);
        } catch (Throwable $e) {
            Log::error('Admin\PortfolioController::store a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => "Impossible de créer l'élément du portfolio."], 500);
        }
    }

    public function update(UpdatePortfolioRequest $request, PortfolioItem $portfolio): JsonResponse
    {
        try {
            $data = $request->safe()->except('media');

            if ($request->hasFile('media')) {
                $file = $request->file('media');
                $isImage = str_starts_with((string) $file->getMimeType(), 'image/');

                $this->deleteStoredFile($portfolio->media_url);
                $this->deleteStoredFile($portfolio->thumbnail_url);

                $data['media_type'] = $isImage ? 'image' : 'video';
                $data['media_url'] = $isImage
                    ? $this->storeUploadedImage($file, 'portfolio')
                    : $this->storeUploadedFile($file, 'portfolio');
                $data['thumbnail_url'] = $this->generateThumbnail($file, 'portfolio/thumbnails');
            }

            $portfolio->update($data);

            return (new PortfolioResource($portfolio))->response();
        } catch (Throwable $e) {
            Log::error('Admin\PortfolioController::update a échoué.', [
                'portfolio_id' => $portfolio->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => "Impossible de mettre à jour l'élément du portfolio."], 500);
        }
    }

    public function destroy(PortfolioItem $portfolio): JsonResponse
    {
        try {
            $this->deleteStoredFile($portfolio->media_url);
            $this->deleteStoredFile($portfolio->thumbnail_url);
            $portfolio->delete();

            return response()->json(['message' => 'Élément du portfolio supprimé.']);
        } catch (Throwable $e) {
            Log::error('Admin\PortfolioController::destroy a échoué.', [
                'portfolio_id' => $portfolio->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => "Impossible de supprimer l'élément du portfolio."], 500);
        }
    }

    public function toggleFeatured(PortfolioItem $portfolio): JsonResponse
    {
        try {
            $portfolio->update(['is_featured' => ! $portfolio->is_featured]);

            return (new PortfolioResource($portfolio))->response();
        } catch (Throwable $e) {
            Log::error('Admin\PortfolioController::toggleFeatured a échoué.', [
                'portfolio_id' => $portfolio->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => "Impossible de mettre à jour l'élément."], 500);
        }
    }
}
