<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'all');
        $search = $request->query('search', '');
        $user = $request->user();

        $expenses = collect();

        if ($type === 'all' || $type === 'expense') {
            $expenses = Expense::query()
                ->with('category')
                ->when($user, fn ($query) => $query->where('user_id', $user->id))
                ->when($search, function ($query) use ($search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('store_name', 'like', "%{$search}%")
                            ->orWhere('memo', 'like', "%{$search}%")
                            ->orWhere('amount', 'like', "%{$search}%");
                    });
                })
                ->get()
                ->map(fn ($expense) => [
                    'id' => 'expense-'.$expense->id,
                    'type' => 'expense',
                    'date' => $expense->spent_at,
                    'title' => $expense->store_name ?? '店舗名なし',
                    'category' => $expense->category?->name ?? '支出',
                    'amount' => $expense->amount,
                ]);
        }

        $incomes = collect();

        if ($type === 'all' || $type === 'income') {
            $incomes = Income::query()
                ->when($user, fn ($query) => $query->where('user_id', $user->id))
                ->when($search, function ($query) use ($search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('memo', 'like', "%{$search}%")
                            ->orWhere('amount', 'like', "%{$search}%")
                            ->orWhere('expected_income', 'like', "%{$search}%");
                    });
                })
                ->get()
                ->map(fn ($income) => [
                    'id' => 'income-'.$income->id,
                    'type' => 'income',
                    'date' => $income->income_date,
                    'title' => $income->memo ?? '収入',
                    'category' => '収入',
                    'amount' => $income->amount ?? $income->expected_income ?? 0,
                ]);
        }

        $transactions = $expenses
            ->concat($incomes)
            ->sortByDesc('date')
            ->values();

        return Inertia::render('Transaction', [
            'transactions' => $transactions,
            'filters' => [
                'type' => $type,
                'search' => $search,
            ],
            'currentMonth' => now()->format('Y年n月'),
        ]);
    }
}
