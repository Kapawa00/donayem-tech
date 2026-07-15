<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesFileUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogPostRequest;
use App\Http\Requests\UpdateBlogPostRequest;
use App\Http\Resources\Admin\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class BlogController extends Controller
{
    use HandlesFileUploads;

    public function index(Request $request): JsonResponse
    {
        $posts = BlogPost::query()
            ->with('author')
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->latest()
            ->paginate(15);

        return BlogPostResource::collection($posts)->response();
    }

    public function show(BlogPost $blog): JsonResponse
    {
        return (new BlogPostResource($blog->load('author')))->response();
    }

    public function store(StoreBlogPostRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['author_id'] = $request->user()->id;

            if ($request->hasFile('cover_image')) {
                $data['cover_image'] = $this->storeUploadedImage($request->file('cover_image'), 'blog');
            }

            if (($data['status'] ?? 'draft') === 'published') {
                $data['published_at'] = now();
            }

            $post = BlogPost::create($data);

            return (new BlogPostResource($post->load('author')))->response()->setStatusCode(201);
        } catch (Throwable $e) {
            Log::error('Admin\BlogController::store a échoué.', ['message' => $e->getMessage()]);

            return response()->json(['message' => "Impossible de créer l'article."], 500);
        }
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blog): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('cover_image')) {
                $this->deleteStoredFile($blog->cover_image);
                $data['cover_image'] = $this->storeUploadedImage($request->file('cover_image'), 'blog');
            }

            if (($data['status'] ?? null) === 'published' && ! $blog->published_at) {
                $data['published_at'] = now();
            }

            $blog->update($data);

            return (new BlogPostResource($blog->load('author')))->response();
        } catch (Throwable $e) {
            Log::error('Admin\BlogController::update a échoué.', [
                'blog_id' => $blog->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => "Impossible de mettre à jour l'article."], 500);
        }
    }

    public function destroy(BlogPost $blog): JsonResponse
    {
        try {
            $this->deleteStoredFile($blog->cover_image);
            $blog->delete();

            return response()->json(['message' => 'Article supprimé.']);
        } catch (Throwable $e) {
            Log::error('Admin\BlogController::destroy a échoué.', [
                'blog_id' => $blog->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => "Impossible de supprimer l'article."], 500);
        }
    }

    public function publish(BlogPost $blog): JsonResponse
    {
        try {
            $blog->update([
                'status' => 'published',
                'published_at' => $blog->published_at ?? now(),
            ]);

            return (new BlogPostResource($blog->load('author')))->response();
        } catch (Throwable $e) {
            Log::error('Admin\BlogController::publish a échoué.', [
                'blog_id' => $blog->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => "Impossible de publier l'article."], 500);
        }
    }

    public function unpublish(BlogPost $blog): JsonResponse
    {
        try {
            $blog->update(['status' => 'draft']);

            return (new BlogPostResource($blog->load('author')))->response();
        } catch (Throwable $e) {
            Log::error('Admin\BlogController::unpublish a échoué.', [
                'blog_id' => $blog->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => "Impossible de dépublier l'article."], 500);
        }
    }
}
