<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', Rule::in(['new', 'reviewing', 'accepted', 'rejected', 'paid'])],
            'admin_notes' => ['nullable', 'string'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
