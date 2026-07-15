<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
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
            'slug' => ['required', 'string', 'max:255', 'unique:services,slug'],
            'category' => ['required', Rule::in(['webdesign', 'marketing', 'formation', 'shopify'])],
            'short_description' => ['nullable', 'array'],
            'short_description.fr' => ['nullable', 'string'],
            'short_description.en' => ['nullable', 'string'],
            'short_description.de' => ['nullable', 'string'],
            'long_description' => ['nullable', 'array'],
            'long_description.fr' => ['nullable', 'string'],
            'long_description.en' => ['nullable', 'string'],
            'long_description.de' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'features' => ['nullable', 'array'],
            'features.fr' => ['nullable', 'array'],
            'features.fr.*' => ['string'],
            'features.en' => ['nullable', 'array'],
            'features.en.*' => ['string'],
            'features.de' => ['nullable', 'array'],
            'features.de.*' => ['string'],
            'starting_price' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
