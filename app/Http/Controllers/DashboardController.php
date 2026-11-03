<?php

// 仮のコントローラー

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Expense;

class DashboardController extends Controller
{
    public function index()
    {
        $expenses = Expense::with('category')
            ->latest('spent_at')
            ->get();

        $total = $expenses->sum('amount');

        return Inertia::render('Dashboard', [
            'summary' => [
                'month' => now()->format('Y年m月'),
                'period' => now()->format('n月の集計'),
                'usedRatePercent' => 0,
                'remainingBudget' => 0,
                'dailyBudget' => 0,
                'adviceMessage' => null,
                'recentTransactions' => $expenses
                    ->take(5)
                    ->map(function ($expense) {
                        return [
                            'id' => $expense->id,
                            'date' => $expense->spent_at,
                            'store' => $expense->store_name ?? '店舗名なし',
                            'category' => $expense->category?->name ?? 'その他',
                            'method' => null,
                            'type' => 'expense',
                            'amount' => $expense->amount,
                        ];
                    })
                    ->values()
            ],
        ]);
    }

    public function calendar()
    {
        $expenses = Expense::query()
            ->whereBetween('spent_at', [
                now()->startOfMonth()->toDateString(),
                now()->endOfMonth()->toDateString(),
            ])
            ->get();

        $dailySpending = $expenses
            ->groupBy(function ($expense) {
                return $expense->spent_at->day;
            })
            ->map(function ($items) {
                return $items->sum('amount');
            });

        return Inertia::render('Calendar', [
            'year' => now()->year,
            'month' => now()->month,
            'dailySpending' => $dailySpending,
            'monthlyTotal' => $expenses->sum('amount'),
            'highSpendingDayCount' => $dailySpending
                ->filter(fn ($amount) => $amount > 0)
                ->count(),
            'paydayLabel' => null,
        ]);
    }
}