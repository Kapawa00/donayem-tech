<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'client_email' => ['required', 'email'],
            'client_phone' => ['required', 'string', 'max:30'],
            'client_company' => ['nullable', 'string', 'max:255'],
            'service_category' => ['required', 'string', 'max:255'],
            'services_requested' => ['required', 'array', 'min:1'],
            'services_requested.*' => ['string'],
            'project_description' => ['required', 'string', 'min:20'],
            'budget_range' => ['nullable', 'string', 'max:255'],
            'deadline' => ['nullable', 'date'],
        ];
    }
}
