<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DokumenConfigResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'key'         => $this->key,
            'value'       => $this->value,
            'description' => $this->description,
            'created_at'  => optional($this->created_at)->format('Y-m-d H:i:s'),
            'updated_at'  => optional($this->updated_at)->format('Y-m-d H:i:s'),
        ];
    }
}