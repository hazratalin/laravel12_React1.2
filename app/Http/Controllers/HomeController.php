<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {

        $posts = Post::latest()->orderby('id', 'desc')->paginate(8);

        // If it's an AJAX request, return JSON (for infinite scroll)
        if ($request->wantsJson()) {
            return response()->json($posts);
        }

        return Inertia::render('welcome', [
            'posts' => PostResource::collection($posts),
        ]);
    }

    // public function index()
    // {
    //     return Inertia::render('welcome');  // points to Laravel's default welcome page
    // }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
