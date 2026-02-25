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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id') //each items connection to their order
                ->constrained()
                ->cascadeOnDelete();
            
            $table->string('drug_name');
            $table->string('ndc')->nullable()->index(); //pharmacy identifier
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->unsignedInteger('price_cents')->default(0);
            $table->timestamps();
            $table->index([ 'order_id', 'ndc' ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
