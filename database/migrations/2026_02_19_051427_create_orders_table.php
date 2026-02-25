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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('external_rx_id')->nullable()->index(); //externall id
            $table->string('patient_name')->index();
            $table->string('status', 32)->index(); //staus for filters -> pending | processing | shipped | cancelled
            $table->unsignedInteger('total_cents')->default(0); //storing money as cents in order to avoid floating point issues
            $table->timestamp('placed_at')->nullable()->index(); //when order is placed-> different than created_at & updated_at from timestamps below
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
