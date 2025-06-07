<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('type');
            $table->string('docker_image');
            $table->enum('status', ['running', 'stopped', 'pending', 'error'])->default('pending');
            $table->integer('credits_per_month');
            $table->string('url');
            $table->string('custom_domain')->nullable();
            $table->boolean('has_custom_domain')->default(false);
            $table->json('environment_variables')->nullable();
            $table->json('ports')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};