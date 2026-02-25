<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        //making sure data is structured and safe 
        return [
            'external_rx_id' => ['nullable', 'string', 'max:255'],
            'patient_name' => ['required', 'string', 'max:225'],
            'status' => ['required', 'in:pending,processing,shipped,cancelled'],
            'placed_at' => ['nullable', 'date'],

            'items' => ['required', 'array', 'min:1'],
            
            'items.*.drug_name' => ['required', 'string', 'max:255'],
            'items.*.ndc' => ['nullable', 'string', 'max:32'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'items.*.price_cents' => ['required', 'integer', 'min:0', 'max:1000000'],
        ];
    }

}
