<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@donayemtech.com'],
            [
                'name' => 'Admin DONAYEM TECH',
                'password' => Hash::make('changeme123'),
                'role' => 'superadmin',
                'email_verified_at' => now(),
            ]
        );
    }
}
