<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'array'],
            'title.fr' => ['required', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'title.de' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:blog_posts,slug'],
            'excerpt' => ['nullable', 'array'],
            'excerpt.fr' => ['nullable', 'string'],
            'excerpt.en' => ['nullable', 'string'],
            'excerpt.de' => ['nullable', 'string'],
            'content' => ['required', 'array'],
            'content.fr' => ['required', 'string'],
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
