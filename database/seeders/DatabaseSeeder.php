<?php

namespace Database\Seeders;

use App\Models\Receiver;
use App\Models\Request;
use App\Models\UnitofMeasure;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'zyb',
            'password' => Hash::make('Bernabe202003'),
            'role' => 'admin'
        ]);
        
        User::factory()->create([
            'username' => 'head',
            'password' => Hash::make('Bernabe202003'),
            'role' => 'head'
        ]);
        User::factory()->create([
            'username' => 'rec',
            'password' => Hash::make('Bernabe202003'),
            'role' => 'receiver'
        ]);
        User::factory()->create([
            'username' => 'end',
            'password' => Hash::make('Bernabe202003'),
            'role' => 'endorser'
        ]);
        User::factory()->create([
            'username' => 'dep',
            'password' => Hash::make('Bernabe202003'),
            'role' => 'department',
            'department' => 'MIS',
        ]);
        
        Request::create([
            'item' => 'Pencil',
            'quantity' => '20',
            'status' => 'pending',
            'user_id' => '5',
        ]);

        UnitofMeasure::insert([
        ['unit_of_measure' => 'pcs'],
        ['unit_of_measure' => 'kg'],
        ['unit_of_measure' => 'box'],
        ['unit_of_measure' => 'cartridge'],
        ]);
    }
}
