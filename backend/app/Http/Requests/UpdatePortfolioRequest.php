<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'array'],
            'title.fr' => ['sometimes', 'required', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'title.de' => ['nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'description.fr' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],
            'description.de' => ['nullable', 'string'],
            'media' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,mp4,mov,webm', 'max:5120'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'completion_date' => ['nullable', 'date'],
            'is_featured' => ['sometimes', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
        ];
    }
}
