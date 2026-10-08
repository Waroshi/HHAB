<?php


use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// ローカルだけで使う画面確認用ルート。DBへの保存やレシートの実解析は行わない。
if (app()->environment('local')) {
    Route::get('/transaction', function (Request $request) {
        $search = $request->query('search', '');
        $type = $request->query('type', 'all');

        // 日付の降順で渡し、検索・収支切り替え・0件表示をDBなしで確認する。
        $transactions = collect([
            ['id' => 'demo-expense-1', 'type' => 'expense', 'date' => '2026-10-04', 'title' => 'デモ：スーパー', 'category' => '食費', 'amount' => 1200],
            ['id' => 'demo-income-1', 'type' => 'income', 'date' => '2026-10-03', 'title' => 'デモ：給与', 'category' => '収入', 'amount' => 50000],
            ['id' => 'demo-expense-2', 'type' => 'expense', 'date' => '2026-10-03', 'title' => 'デモ：カフェ', 'category' => '食費', 'amount' => 500],
        ])->filter(function ($transaction) use ($search, $type) {
            $matchesType = $type === 'all' || $transaction['type'] === $type;
            $matchesSearch = $search === ''
                || str_contains($transaction['title'], $search)
                || str_contains((string) $transaction['amount'], $search);

            return $matchesType && $matchesSearch;
        })->values();

        return Inertia::render('Transaction', [
            'transactions' => $transactions,
            'filters' => ['search' => $search, 'type' => $type],
            'currentMonth' => '2026年10月・画面確認用デモ（DB保存なし）',
        ]);
    })->name('transactions.index');

    Route::get('/calendar', fn () => Inertia::render('Calendar'))->name('calendar.index');
    Route::get('/readings', fn () => Inertia::render('Scan'))->name('readings.index');
    Route::get('/readings/result', fn () => Inertia::render('ReadingResult'))->name('readings.result');
    Route::get('/reports', fn () => Inertia::render('Report'))->name('reports.index');
    Route::get('/menu', fn () => Inertia::render('Menu'))->name('menu.index');
} else {
    Route::get('/transaction', [TransactionController::class, 'index'])->name('transactions.index');
}

Route::get('/readings', function () {
    return Inertia::render('Readings');
})->name('readings.index');

Route::get('/calendar', function () {
    return Inertia::render('Calendar/Index');
})->name('calendar.index');

Route::get('/reports', function () {
    return Inertia::render('Reports/Index');
})->name('reports.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
