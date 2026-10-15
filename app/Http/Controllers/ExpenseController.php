<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Category;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_name' => ['nullable', 'string', 'max:255'],
            'spent_at' => ['required', 'date'],
            'category_id' => ['required', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'memo' => ['nullable', 'string', 'max:255'],
        ]);

        Expense::create($validated);

        return redirect() ->route('dashboard');
    }
}