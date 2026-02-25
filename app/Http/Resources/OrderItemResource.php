<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
                'id' => $this->id,
                'drug_name' => $this->drug_name,
                'ndc' => $this->ndc,
                'quantity' => $this->quantity,
                'price_cents' => $this->price_cents
        ];
    }
}
