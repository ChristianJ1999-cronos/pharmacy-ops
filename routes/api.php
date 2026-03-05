<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrderController;

Route::get('/orders', [OrderController::class, 'index'] ); //listing all orders
Route::post('/orders', [OrderController::class, 'store'] ); //creating orders
Route::get('/orders/{order}', [OrderController::class, 'show'] ); //show a single order
Route::patch('/orders/{order}', [OrderController::class, 'update']); //updating fields
Route::delete('/orders/{order}', [OrderController::class, 'remove']); //deleting order

Route::get('/orders/stats', [OrderController::class, 'stats']);