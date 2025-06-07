<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ServiceType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => env('ADMIN_NAME', 'Novian Admin'),
            'email' => env('ADMIN_EMAIL', 'novian@digilunar.com'),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'novian@digilunar.com')),
            'credits' => 10000,
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create default service types
        ServiceType::create([
            'name' => 'n8n Workflow Automation',
            'type' => 'n8n',
            'docker_image' => 'n8nio/n8n:latest',
            'description' => 'Powerful workflow automation platform with visual editor and 200+ integrations',
            'credits_per_month' => 50,
            'status' => 'published',
            'default_environment' => [
                'N8N_BASIC_AUTH_ACTIVE' => 'true',
                'N8N_BASIC_AUTH_USER' => 'admin',
                'N8N_BASIC_AUTH_PASSWORD' => ''
            ],
            'default_ports' => [
                ['internal' => 5678, 'external' => 5678, 'protocol' => 'HTTP']
            ]
        ]);

        ServiceType::create([
            'name' => 'Chatwoot Customer Support',
            'type' => 'chatwoot',
            'docker_image' => 'chatwoot/chatwoot:latest',
            'description' => 'Open-source customer engagement platform with live chat and multi-channel support',
            'credits_per_month' => 40,
            'status' => 'published',
            'default_environment' => [
                'POSTGRES_PASSWORD' => '',
                'REDIS_PASSWORD' => '',
                'SECRET_KEY_BASE' => '',
                'POSTGRES_USER' => 'chatwoot',
                'POSTGRES_DB' => 'chatwoot_production'
            ],
            'default_ports' => [
                ['internal' => 3000, 'external' => 3000, 'protocol' => 'HTTP']
            ]
        ]);

        ServiceType::create([
            'name' => 'PostgreSQL Database',
            'type' => 'database',
            'docker_image' => 'postgres:15-alpine',
            'description' => 'Reliable PostgreSQL database with automatic backups and high availability',
            'credits_per_month' => 30,
            'status' => 'published',
            'default_environment' => [
                'POSTGRES_DB' => 'myapp',
                'POSTGRES_USER' => 'admin',
                'POSTGRES_PASSWORD' => ''
            ],
            'default_ports' => [
                ['internal' => 5432, 'external' => 5432, 'protocol' => 'TCP']
            ]
        ]);
    }
}