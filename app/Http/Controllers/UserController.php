<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        // return Inertia::render("Users/Index", [
        //     "users" => User::with('roles')->get()
        // ]);


        return Inertia::render("Users/Index", [
    "users" => User::with('roles')->get()->map(function ($user) {
        return $user->toArray(); // Ensures all accessors like image_url are included
    }),
]);


    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            "roles" => Role::pluck("name")
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:1',
            'image'    => 'nullable|image',
            'roles'    => 'required|array',
            'roles.*'  => 'string|exists:roles,name',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['image'] = $this->handleImageUpload($request, $data['name']);

        $user = User::create($data);
        $user->syncRoles($request->roles);

        return to_route('users.index')->with('success', 'User created successfully.');
    }

    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Users/Show', compact('user'));
    }

    public function edit(string $id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Users/Edit', [
            "user"      => $user,
            "roles"     => Role::pluck("name"),
            "userRoles" => $user->roles->pluck("name"),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:1',
            'image'    => 'nullable|image',
            'roles'    => 'required|array',
            'roles.*'  => 'string|exists:roles,name',
        ]);

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
