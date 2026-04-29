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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->json('item');
            $table->json('quantity');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('message')->nullable();
            $table->string('endorser_message')->nullable();
            $table->string('issued_item')->nullable();
            $table->integer('fulfilled_quantity')->nullable();
            $table->integer('unfulfilled_quantity')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
