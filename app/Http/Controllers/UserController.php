<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Pest\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Users/Index", [
            "users" => User::with('roles')->get()->map(function ($user) {
                return $user->toArray(); // Ensures all accessors like image_url are included
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create', [
            "roles" => Role::pluck("name")
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {

        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['image'] = $this->handleImageUpload($request, $data['name']);

        $user = User::create($data);
        $user->syncRoles($request->roles);

        return to_route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('roles');

        return Inertia::render('Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'image_url' => $user->image
                    ? asset('storage/' . $user->image)
                    : null,
                'roles' => $user->roles->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                ])->toArray(),
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            "user"      => $user,
            "roles"     => Role::pluck("name"),
            "userRoles" => $user->roles->pluck("name"),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {

        $data = $request->validated();
        $data['image'] = $this->handleImageUpload($request, $data['name'], $user->image);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        $user->syncRoles($request->roles);

        return to_route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Optional: Prevent user from deleting themselves
        if (auth()->id() === $user->id) {
            return back()->with('danger', 'You cannot delete yourself.');
        }

        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();

        return to_route('users.index')->with('success', 'User deleted successfully.');
    }

    /**
     * Handle image upload and return file path or null.
     */
    private function handleImageUpload(Request $request, string $name, ?string $oldImage = null): ?string
    {
        if (!$request->hasFile('image')) {
            return $oldImage;
        }

        // Delete old image
        if ($oldImage) {
            Storage::disk('public')->delete($oldImage);
        }

        $userName = str($name)->slug();
        $timestamp = now()->format('Ymd-His');
        $extension = $request->file('image')->getClientOriginalExtension();
        $filename = "{$userName}-{$timestamp}.{$extension}";

        return $request->file('image')->storeAs('profileImage', $filename, 'public');
    }
}
