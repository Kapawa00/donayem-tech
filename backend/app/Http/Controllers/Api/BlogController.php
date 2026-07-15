<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $posts = BlogPost::query()
            ->where('status', 'published')
            ->when($request->filled('category'), fn ($query) => $query->where('category', $request->input('category')))
            ->select(['id', 'title', 'slug', 'excerpt', 'cover_image', 'category', 'published_at'])
            ->latest('published_at')
            ->paginate(9);

        return BlogPostResource::collection($posts)->response();
    }

    public function categories(): JsonResponse
    {
        $categories = BlogPost::query()
            ->where('status', 'published')
            ->whereNotNull('category')
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return response()->json(['data' => $categories]);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::with('author')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return (new BlogPostResource($post))->response();
    }
}
