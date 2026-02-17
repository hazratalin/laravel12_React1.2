<?php

namespace App\Http\Resources;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return 
        [      
             'id' => $this->id,
        'name' => $this->name,
        'description' => $this->description,
        'status' => $this->status,
        'created_by' => new UserResource($this->createdBy),
        'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
        'due_date' => $this->due_date
    ? (new Carbon($this->due_date))->format('Y-m-d')
    : null,

        'image_url' => $this->image_path
            ? asset('storage/' . $this->image_path)
            : asset('images/fallback.jpg'),  
           
        ];
    }
}
