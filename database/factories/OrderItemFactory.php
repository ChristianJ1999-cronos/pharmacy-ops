<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'drug_name' => fake()->randomElement([
                'Acetaminophen 500mg',
                'Loratadine 200mg',
                'Omeprazole 500mg',
                'Omeprazole 20mg',
                'Ibuprofen 10mg',
            ]),
            'ndc' => fake()->optional()->numerify('#####-####-##'),
            'quantity' => fake()->numberBetween(1, 10),
            'price_cents' => fake()->numberBetween(500, 5000),
        ];
    }
}
