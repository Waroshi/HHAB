<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_name' => ['nullable', 'string', 'max:255'],
            'purchased_at' => ['required', 'date'],
            'total_amount' => ['required', 'integer', 'min:1'],
            'category' => [
                'required',
                'in:食費,日用品,交通費,娯楽,その他',
            ],
            'payment_method' => [
                'required',
                'in:現金,クレジットカード,電子マネー,その他',
            ],
            'memo' => ['nullable', 'string', 'max:1000'],
        ]);

        $category = Category::firstOrCreate([
            'user_id' => null,
            'name' => $validated['category'],
        ]);

        Expense::create([
            'user_id' => auth()->id(),
            'store_name' => $validated['storeName'] ?? null,
            'spent_at' => $validated['purchasedAt'],
            'category_id' => $category->id,
            'amount' => $validated['totalAmount'],
            'payment_method' => $validated['paymentMethod'],
            'memo' => $validated['memo'] ?? null,
        ]);

        return redirect() ->route('dashboard');
    }
}