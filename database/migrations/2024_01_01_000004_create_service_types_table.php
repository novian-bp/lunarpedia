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
        Schema::create('service_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('docker_image');
            $table->text('description');
            $table->integer('credits_per_month');
            $table->enum('status', ['published', 'draft', 'archived'])->default('draft');
            $table->json('default_environment')->nullable();
            $table->json('default_ports')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_types');
    }
};