<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
        return [
            "image_path" => "nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            "name" => "required|string|max:255",
            "status" => "required|in:Pending,In_Progress,Completed",
            "priority" => "required|in:Low,Medium,High",
            "project_id" => "required|exists:projects,id",
            "assigned_user_id" => "nullable|exists:users,id",

            "description" => "nullable|string",
            "due_date" => "nullable|date",

        ];
    }
}
