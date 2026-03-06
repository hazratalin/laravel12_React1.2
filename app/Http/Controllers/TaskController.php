<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use Inertia\Inertia;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class TaskController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $query = Task::query();
        $query = Task::with(['project', 'assignedUser', 'createdBy', 'updatedBy']);

        $sortField = request("sort_field") ?? 'created_at';
        $sortDirection = request("sort_direction") ?? 'desc';

        if (request("name")) {
            $query->where('name', 'like', '%' . request("name") . '%');
        }

        if (request("status")) {
            $query->where('status', request("status"));
        }

        $tasks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Tasks/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: [], // <-- always an array
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        return Inertia::render('Tasks/Create', [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    private function handleImageUpload(Request $request, string $name, ?string $oldImage = null): ?string
    {
        if (!$request->hasFile('image_path')) {
            return $oldImage;
        }

        // Delete old image if exists
        if ($oldImage) {
            Storage::disk('public')->delete($oldImage);
        }

        $slug = Str::slug($name);
        $timestamp = now()->format('Ymd-His');
        $extension = $request->file('image_path')->getClientOriginalExtension();
        $filename = "{$slug}-{$timestamp}.{$extension}";

        return $request->file('image_path')->storeAs('tasks', $filename, 'public');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        // Handle image upload
        $data['image_path'] = $this->handleImageUpload($request, $data['name']);

        $data['created_by'] = Auth::id();

        $task = Task::create($data);

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {

        return inertia('Tasks/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Task $task)
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        return Inertia::render('Tasks/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),

        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();

        // Handle image upload (replace old image if new uploaded)
        $data['image_path'] = $this->handleImageUpload(
            $request,
            $data['name'] ?? $task->name,
            $task->image_path
        );

        // track updater
        $data['updated_by'] = Auth::id();

        // update task
        $task->update($data);

        return redirect()
            ->route('tasks.index')
            ->with('success', "Task '{$task->name}' updated successfully.");
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if ($task->image_path) {
            Storage::disk('public')->delete($task->image_path);
        }

        $name = $task->name;
        $task->delete();

        return to_route('tasks.index')->with('success', "Task '{$name}' deleted successfully.");
    }
}
