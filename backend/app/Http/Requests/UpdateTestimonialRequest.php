<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['sometimes', 'required', 'string', 'max:255'],
            'client_company' => ['nullable', 'string', 'max:255'],
            'client_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'content' => ['sometimes', 'required', 'array'],
            'content.fr' => ['sometimes', 'required', 'string'],
            'content.en' => ['nullable', 'string'],
            'content.de' => ['nullable', 'string'],
            'rating' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'service_category' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
