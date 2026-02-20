<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/posts-home', [PostController::class, 'indexHome'])->name('posts.home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');

    Route::resource('projects', ProjectController::class);

    Route::resource('tasks', TaskController::class);

    Route::resource('posts', PostController::class);
    //  Route::resource('posts', PostController::class)->except('index');
    // Users Routes

    Route::resource('users', UserController::class)->only(["create", "store"])->middleware("permission:users.create");
    Route::resource('users', UserController::class)->only(["edit", "update"])->middleware("permission:users.edit");
    Route::resource('users', UserController::class)->only(["destroy"])->middleware("permission:users.delete");
    Route::resource('users', UserController::class)->only(["index", "show"])->middleware("permission:users.view|users.create|users.edit|users.delete");

    Route::resource('roles', RoleController::class)->only(["create", "store"])->middleware("permission:roles.create");
    Route::resource('roles', RoleController::class)->only(["edit", "update"])->middleware("permission:roles.edit");
    Route::resource('roles', RoleController::class)->only(["destroy"])->middleware("permission:roles.delete");
    Route::resource('roles', RoleController::class)->only(["index", "show"])->middleware("permission:roles.view|roles.create|roles.edit|roles.delete");

    // Route::controller(PostController::class)->group(function () {
    //     Route::get('posts','index')->name('posts.index');
    //     Route::inertia('posts/create', 'posts/create')->name('posts.create');
    //     Route::post('posts', 'store')->name('posts.store');
    //     Route::get('posts/{post}/edit', 'edit')->name('posts.edit');
    //     Route::put('posts/{post}', 'update')->name('posts.update');
    //     Route::delete('posts/{post}', 'destroy')->name('posts.destroy');
    // });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
