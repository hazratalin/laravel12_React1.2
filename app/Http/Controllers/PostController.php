<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Resources\PostResource;
class PostController extends Controller
{

        public function indexHome(Request $request)
    {
        
  //   dd(now()->format('Y-m-d H:i:s'));
        // $posts = Post::latest()->take(3)->get();
        $posts = Post::latest()->paginate(8);
        
        // $posts = Post::all();
        //  $posts = Post::orderBy('created_at', 'desc')->paginate(6);
        // $posts = Post::orderBy('created_at', 'desc')->get();
            // dd($posts);
        return Inertia::render('Home', [
            'posts' => $posts,
        ]);
    }


 

// public function index(Request $request)
// {
//      $posts = $request->user()
//         ->posts()
//         ->orderByDesc('created_at') // ✅ Order by latest first
//         ->paginate(5);

//     // Transform each post to include full image URL
//     $posts->getCollection()->transform(function ($post) {
//         $post->image = $post->image
//             ? Storage::url($post->image)
//             : '/images/fallback.jpg';
//         return $post;
//     });

//     return Inertia::render('Posts/Index', [
//         'posts' => $posts->toArray(), // ✅ this ensures posts.links and posts.data exist
//     ]);
// }

public function index(Request $request)
{
    $query = $request->user()->posts()->latest();

    // 🔍 Apply search filter if provided
    if ($search = $request->input('search')) {
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%");
        });
    }

    $posts = $query->paginate(8)->withQueryString(); // 👈 preserve filters in pagination

    // Add full image URLs
    $posts->getCollection()->transform(function ($post) {
        $post->image = $post->image
            ? \Storage::url($post->image)
            : '/images/fallback.jpg';
        return $post;
    });

    return Inertia::render('Posts/Index', [
        'posts' => $posts->toArray(),
        'filters' => $request->only('search'), // send back current filters to frontend
    ]);
}


    // public function index(Request $request)
    // {

    //     $posts = $request->user()->posts()->paginate(5);
    
    //     return Inertia::render('Posts/Index', [
    
    //         'posts' => PostResource::collection($posts),
    //     ]);
    // }

    public function create()
    {
        // Return an Inertia response to render the create post page
        return Inertia::render('Posts/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'content' => 'required',
            'image' => 'required|image',
        ]);

        $data['slug'] = str($data['title'])->slug();

        if ($request->hasFile('image')) {
    $titleSlug = str($data['title'])->slug(); // Laravel's str() helper
    $timestamp = now()->format('Ymd-His');    // e.g., 20251002-143512
    $extension = $request->file('image')->getClientOriginalExtension();

    $filename = "{$titleSlug}-{$timestamp}.{$extension}";

    $data['image'] = $request->file('image')->storeAs('posts', $filename, 'public');
}


        $request->user()->posts()->create($data);

        return to_route('posts.index')->with('success', 'Post created successfully.');
    }
    
    public function edit(Post $post)
    {
        return inertia('Posts/Edit', [
            'currentPost' => new PostResource($post),
        ]);
    }

public function update(Request $request, Post $post)
{
    $data = $request->validate([
        'title' => 'required',
        'content' => 'required',
        'image' => 'nullable|image',
    ]);

    $data['slug'] = str($data['title'])->slug();
    $data['image'] = $post->image;

    if ($request->hasFile('image')) {
    Storage::disk('public')->delete($post->image);

    $titleSlug = str($data['title'])->slug();
    $timestamp = now()->format('Ymd-His');
    $extension = $request->file('image')->getClientOriginalExtension();

    $filename = "{$titleSlug}-{$timestamp}.{$extension}";

    $data['image'] = $request->file('image')->storeAs('posts', $filename, 'public');
}

    $post->update($data);

    return to_route('posts.index')->with('success', 'Post updated successfully.');
}

    public function destroy(Post $post)
    {
        Storage::disk('public')->delete($post->image);
        $post->delete();

        return to_route('posts.index')->with('success', 'Post deleted successfully.');
    }
}