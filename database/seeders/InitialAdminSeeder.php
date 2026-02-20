<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class InitialAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define all permissions
        $permissions = [
            "users.view",
            "users.edit",
            "users.delete",
            "users.create",
            "roles.view",
            "roles.edit",
            "roles.delete",
            "roles.create",
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(["name" => $perm]);
        }

        // 2. Create the admin role
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Assign all permissions to the admin role
        $adminRole->syncPermissions($permissions);

        // 3. Create the initial admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'hazratalin@gmail.com'],
            [
                'name' => 'admin',
                'password' => bcrypt('1') // Change to a secure password
            ]
        );

        // Assign the admin role to the user
        $adminUser->assignRole($adminRole);

        $this->command->info('✅ Admin user, role, and permissions have been created.');
    }
}
