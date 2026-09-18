<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specialty_id')->constrained()->restrictOnDelete();
            $table->string('name', 150);
            $table->text('bio')->nullable();
            $table->string('city', 100);
            $table->string('address', 255)->nullable();
            $table->string('avatar', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index('specialty_id');
            $table->index('city');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
