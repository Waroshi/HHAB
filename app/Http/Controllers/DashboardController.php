<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Symfony\Component\HttpFoundation\RequestMatcher\ExpressionRequestMatcher;

class DashboardController extends Controller
{
    public function index()
    {
        $espenses = Expence::with('Category')
            ->latest('spent_at')
            ->get();
        $total = $espenses->sum('amount');

        return Inertia::render('Dashboard', [
            'summary' => [
                'month' => now()->format('Y年m月'),
                'period' => now()->format('Y-m-d') . ' 〜 ' . now()->format('Y-m-d'),
                'usedRatePercent' => 0,
                'remainingBudget' => 0,
                'dailybudget' => 0,
                'adviceMessage' => null,
                'recentTransactions' => &expences
                    ->take(5)
                    ->map(fn ($expence) => [
                        return [
                            'id' => $expence->id,
                            'title' => $expence->title,
                            'amount' => $expence->amount,
                            'category' => $expence->category->name,
                            'spent_at' => $expence->spent_at->format('Y-m-d'),
                        ]
    ],
]);