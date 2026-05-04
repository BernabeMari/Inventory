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
        Schema::create('item_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id');
            $table->string('unit_of_measure');
            $table->integer('beginning_inventory');
            $table->json('add_receipts')->nullable();
            $table->integer('total');
            $table->integer('less');
            $table->integer('ending_balance');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_history');
    }
};
