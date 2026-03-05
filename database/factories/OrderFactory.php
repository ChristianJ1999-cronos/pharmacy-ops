<?php

namespace Database\Factories;


use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;
use App\Models\OrderItem;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'external_rx_id' => $this->faker->optional()->bothify('RX-#####'),
            'patient_name' => $this->faker->name(),
            'status' => $this->faker->randomElement( ['pending', 'processing', 'shipped', 'cancelled'] ),
            'total_cents' => 0, //compute this after items get created
            'placed_at' => $this->faker->dateTimeBetween('-30 days', 'now'), //random date in the last month (30 days to be specific) 
        ];
    }

    public function configure(): static{
        return $this->afterCreating(function ( Order $order ){
            $items = OrderItem::factory()
                ->count($this->faker->numberBetween(1,4))
                ->create( ['order_id' => $order->id] ); //where we create 1-4 order items

            $total = $items->sum(fn ($item) => $item->price_cents * $item->quantity);
            $order->update( ['total_cents' => $total] );

        });
    }

}
