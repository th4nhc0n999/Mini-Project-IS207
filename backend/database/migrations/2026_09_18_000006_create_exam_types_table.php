<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hospital_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->decimal('price', 10, 2);
            $table->softDeletes();
            $table->timestamps();
            $table->index('hospital_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_types');
    }
};
