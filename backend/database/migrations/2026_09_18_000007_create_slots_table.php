<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('slots', function (Blueprint $table) {
            $table->id();
            $table->enum('owner_type', ['doctor', 'hospital']);
            $table->unsignedBigInteger('owner_id');
            $table->date('work_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedInteger('capacity')->default(1);
            $table->unsignedInteger('booked_count')->default(0);
            $table->enum('status', ['available', 'full', 'blocked'])->default('available');
            $table->timestamps();
            $table->unique(['owner_type', 'owner_id', 'work_date', 'start_time']);
            $table->index(['owner_type', 'owner_id', 'work_date']);
        });

        DB::statement('ALTER TABLE slots ADD CONSTRAINT slots_booked_count_check CHECK (booked_count <= capacity)');
    }

    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};
