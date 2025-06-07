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
        Schema::create('user_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('addon_type');
            $table->string('addon_name');
            $table->integer('credits_per_month');
            $table->enum('status', ['active', 'cancelled'])->default('active');
            $table->timestamp('activated_at')->useCurrent();
            $table->timestamp('next_billing');
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('service_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addons');
    }
};