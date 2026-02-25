<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListOrdersRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;


class OrderController extends Controller{
    
    //get the /api/orders
    public function index(ListOrdersRequest $request){

        $filters = $request->validated();

        $query = Order::query()->withCount('items');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        //here we seach by the patient name or the external id
        if(!empty( $filters['q'] ) ){
            $term = $filters['q'];

            $query->where( function ($q) use ($term) {
                $q->where('patient_name', 'like', "%{$term}%" )
                ->orWhere('external_rx_id', 'like', "%{$term}%" );
            });
        }

        //filtering date range. look at placed_at FROM and TO
        if (!empty($filters['from'])) {
            $query->whereDate('placed_at', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->whereDate('placed_at', '<=', $filters['to']);
        }

        //sorting newest 1st
        $query->orderByDesc('placed_at')
            ->orderByDesc('created_at');

        $perPage = $filters['per_page'] ?? 15; //how many to show for pagination

        $orders = $query->paginate($perPage)->withQueryString();
        return OrderResource::collection($orders);
    }

    //get the /api/orders/{order}
    public function show(Order $order){
        $order->load('items')->loadCount('items');
        return new OrderResource($order);
    }

    //post the /api/orders
    public function store(StoreOrderRequest $request ): JsonResponse {
        $data = $request->validated();

        $order = DB::transaction(function () use ($data) {
            $order = Order::create([
                'external_rx_id' => $data['external_rx_id'] ?? null,
                'patient_name' => $data['patient_name'],
                'status' => $data['status'],
                'placed_at' => $data['placed_at'] ?? now(),
                'total_cents' => 0,
            ]);

            $order->items()->createMany($data['items']); //creating items for said order
            $total = collect( $data['items'])->sum(fn ($item) => $item['price_cents'] * $item['quantity']); //computing total_cents
            $order->update( ['total_cents' => $total] );
            return $order;
        });

        $order->load('items')->loadCount('items');

        return response()->json(new OrderResource($order), 201);
    }

    public function update(Request $request, Order $order){
        $data = $request->validate([
            'status' => ['sometimes', 'required', 'in:pending,processing,shipped,cancelled']
        ]);

        // place allowed fields into model
        $order->fill($data);

        $order->save();

        return response()->json([
            'data' => $order->loadCount('items')
        ]);

    }

    public function remove(Order $order) {
        $order->delete();
        return response()->noContent();
    }

    // public function removeItem()

}
