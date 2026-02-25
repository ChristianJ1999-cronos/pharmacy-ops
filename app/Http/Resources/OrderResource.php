<?php

namespace App\Http\Resources;

use App\Http\Resources\OrderItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'external_rx_id' => $this->external_rx_id,
            'patient_name' => $this->patient_name,
            'status' => $this->status,
            'total_cents' => $this->total_cents,
            'placed_at' => optional($this->placed_at)->toISOString(),
            'created_at' => optional($this->created_at)->toISOString(),

            'items_count' => $this->when(isset($this->items_count), $this->items_count),

            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            
        ];
    }
}
