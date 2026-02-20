<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Post;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Hazrat Ali',
        //     'email' => 'hazratalin@gmail.com',
        //     'password' => bcrypt('1'),
        //     'email_verified_at' => time(),
        // ]);

        Project::factory()->count(30)->hasTasks(30)->create();


        Post::factory(3)->create();

        // $this->call(PermissionSeeder::class);

        // $this->call([
        //     InitialAdminSeeder::class,
        // ]);

        // php artisan db:seed
    }
}
