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
            'drug_name' => $this->faker->randomElement([
                'Acetaminophen 500mg',
                'Loratadine 200mg',
                'Omeprazole 500mg',
                'Omeprazole 20mg',
                'Ibuprofen 10mg',
            ]),
            'ndc' => $this->faker->optional()->numerify('#####-####-##'),
            'quantity' => $this->faker->numberBetween(1, 10),
            'price_cents' => $this->faker->numberBetween(500, 5000),
        ];
    }
}
