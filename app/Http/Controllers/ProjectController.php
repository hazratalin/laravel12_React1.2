<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Inertia\Inertia;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;



class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query();

        $sortField = request("sort_field") ?? 'created_at';
        $sortDirection = request("sort_direction") ?? 'desc';

        if (request("name")) {
            $query->where('name', 'like', '%' . request("name") . '%');
        }

        if (request("status")) {
            $query->where('status', request("status"));
        }
        $projects = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Projects/Index', [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: [], // <-- always an array
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Projects/Create');
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

        return $request->file('image_path')->storeAs('projects', $filename, 'public');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        // $project = ($request->validated());
        // dd($project);

        $data = $request->validated();

        // Handle image upload
        $data['image_path'] = $this->handleImageUpload($request, $data['name']);

        // Set created_by
        $data['created_by'] = Auth::id();

        $project = Project::create($data);

        return redirect()
            ->route('projects.index', $project)
            ->with('success', 'Project created successfully.');
    }



    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $query = $project->tasks();
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
        return inertia('Projects/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: [], // <-- always an array
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {

        $data = $request->validated();

        // Handle image upload (keep old image if none uploaded)
        $data['image_path'] = $this->handleImageUpload(
            $request,
            $data['name'],
            $project->image_path
        );



        $data['updated_by'] = Auth::id();

        $project->update($data);

        return to_route('projects.index')
            ->with('success', "Project '{$project->name}' updated successfully.");
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }

        $name = $project->name;
        $project->delete();

        return to_route('projects.index')->with('success', "Project '{$name}' deleted successfully.");
    }
}
