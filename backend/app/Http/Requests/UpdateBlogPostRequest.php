<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $postId = $this->route('blog')?->id;

        return [
            'title' => ['sometimes', 'required', 'array'],
            'title.fr' => ['sometimes', 'required', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'title.de' => ['nullable', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('blog_posts', 'slug')->ignore($postId)],
            'excerpt' => ['nullable', 'array'],
            'excerpt.fr' => ['nullable', 'string'],
            'excerpt.en' => ['nullable', 'string'],
            'excerpt.de' => ['nullable', 'string'],
            'content' => ['sometimes', 'required', 'array'],
            'content.fr' => ['sometimes', 'required', 'string'],
            'content.en' => ['nullable', 'string'],
            'content.de' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
            'meta_title' => ['nullable', 'array'],
            'meta_title.fr' => ['nullable', 'string', 'max:255'],
            'meta_title.en' => ['nullable', 'string', 'max:255'],
            'meta_title.de' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'array'],
            'meta_description.fr' => ['nullable', 'string', 'max:255'],
            'meta_description.en' => ['nullable', 'string', 'max:255'],
            'meta_description.de' => ['nullable', 'string', 'max:255'],
        ];
    }
}
