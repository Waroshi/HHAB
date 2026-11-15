// resources/js/Pages/Transaction.jsx
// Shows the mobile transaction list screen.
// Exists so users can search and filter income and expense transactions.
// RELATED FILES: app/Http/Controllers/TransactionController.php, resources/js/Layouts/AuthenticatedLayout.jsx, routes/web.php

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const sampleSpending = [
    { id: 'sample-lunch', title: '昼食', amount: 850 },
    { id: 'sample-cafe', title: '友人とのカフェ', amount: 1200 },
    { id: 'sample-daily', title: '日用品', amount: 600 },
];

export default function Transaction({
    transactions = [],
    filters = { search: '', type: 'all' },
    currentMonth = '',
    isGuest = false,
    flash = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const hasFilters = Boolean(filters.search || filters.type !== 'all');
    useEffect(() => setSearch(filters.search ?? ''), [filters.search]);

    const clearFilters = () => {
        setSearch('');
        applyFilters({ search: '', type: 'all' });
    };

    const groupedTransactions = useMemo(() => {
        return transactions.reduce((groups, transaction) => {
            const date = formatDate(transaction.date);

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(transaction);

            return groups;
        }, {});
    }, [transactions]);

    const applyFilters = (nextFilters) => {
        router.get(
            route('transactions.index'),
            {
                search,
                type: filters.type,
                ...nextFilters,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    return (
        <AuthenticatedLayout>
        <div className="px-5 pb-8 pt-6 text-neutral-900 dark:text-neutral-100">
            <Head title="取引一覧" />

            <section className="mx-auto max-w-md">
                <h1 className="text-2xl font-bold">取引一覧</h1>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {currentMonth}
                </p>
                {flash.success && <p role="status" className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-800/40 dark:text-brand-200">{flash.success}</p>}
                {isGuest && <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">記録する前に、下のサンプルで振り返りを試せます。自分の記録を保存・表示するには<Link href={route('login')} className="underline">ログイン</Link>してください。</p>}

                <form onSubmit={submitSearch} className="mt-6">
                    <input
                        aria-label="店舗名・メモ・金額で検索"
                        type="search"
                        maxLength={255}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="店舗名・メモ・金額で検索"
                        className="w-full rounded-full border border-neutral-400 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:ring-2 focus:ring-brand-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400"
                    />
                </form>

                <div className="mt-5 flex gap-2">
                    <FilterButton
                        active={filters.type === 'all'}
                        onClick={() => applyFilters({ type: 'all' })}
                    >
                        すべて
                    </FilterButton>
                    <FilterButton
                        active={filters.type === 'expense'}
                        onClick={() => applyFilters({ type: 'expense' })}
                    >
                        支出
                    </FilterButton>
                    <FilterButton
                        active={filters.type === 'income'}
                        onClick={() => applyFilters({ type: 'income' })}
                    >
                        収入
                    </FilterButton>
                </div>

                <SpendingReflection transactions={transactions} filterKey={`${filters.type}:${filters.search}`} />

                {hasFilters && <button type="button" onClick={clearFilters} className="mt-3 min-h-11 rounded-lg px-2 text-sm text-brand-700 underline focus-visible:ring-2 focus-visible:ring-brand-600 dark:text-brand-200">検索・収支の条件を解除</button>}
                {transactions.length === 0 && <p role="status" className="mt-4 rounded-xl border border-neutral-300 p-4 text-sm dark:border-neutral-700">{isGuest ? 'ログイン前のため、自分の取引は表示していません。サンプルは一覧・集計に入りません。' : hasFilters ? '現在の検索・収支の条件に一致する取引がありません。条件を解除すると、ほかの記録を確認できます。' : 'まだ取引の記録がありません。下の「読み取り」から支出を入力できます。'}</p>}

                <div className="mt-8 space-y-8">
                    {Object.entries(groupedTransactions).map(([date, items]) => (
                        <section key={date}>
                            <h2 className="text-base font-bold text-neutral-600 dark:text-neutral-300">
                                {date}
                            </h2>

                            <div className="mt-4 space-y-4">
                                {items.map((transaction) => (
                                    <TransactionCard
                                        key={transaction.id}
                                        transaction={transaction}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </section>

        </div>
        </AuthenticatedLayout>
    );
}

function SpendingReflection({ transactions, filterKey }) {
    const [selectedSpendingId, setSelectedSpendingId] = useState(null);

    // 検索・絞り込み後に表示されている支出だけを候補にする。
    const spending = transactions.filter((transaction) => {
        const amount = Number(transaction.amount);
        return transaction.type === 'expense' && Number.isFinite(amount) && amount > 0;
    }).slice(0, 3);
    const isSample = spending.length === 0;
    const choices = isSample ? sampleSpending : spending;
    const selectedSpending = choices.find((item) => item.id === selectedSpendingId);
    // 絞り込みで候補が変わったら選択を解除する。条件を戻しても古い選択を復活させない。
    const choiceKey = choices.map((item) => item.id).join(',');
    useEffect(() => setSelectedSpendingId(null), [choiceKey, filterKey]);
    const reflectionLabel = isSample ? 'サンプルで振り返りを試す' : '使ってよかったお金を振り返る';
    const instruction = isSample ? 'この表示には支出がないため、サンプルで試せます。一覧・集計には入りません。' : '検索・収支の条件に合う、今の一覧の支出から最大3件を表示しています。';

    return (
        <details className="group mt-6 rounded-2xl border border-brand-200 bg-brand-50 px-4 dark:border-brand-700 dark:bg-brand-800/30">
            <summary className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md py-3 text-sm font-bold text-[#113A28] dark:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 group-open:rotate-90">
                    <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {reflectionLabel}
            </summary>

            <div className="space-y-3 pb-4">
                <p className="text-sm font-bold">使ってよかったのはどれ？</p>
                <p className="text-xs text-gray-600 dark:text-neutral-300">{instruction}</p>

                {choices.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        aria-pressed={item.id === selectedSpendingId}
                        onClick={() => setSelectedSpendingId(item.id)}
                        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-gray-400 bg-white px-3 py-2 text-left text-sm text-gray-900 hover:border-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 aria-pressed:border-brand-700 aria-pressed:bg-[#EAF8F1] dark:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-100 dark:aria-pressed:bg-brand-800/40 dark:aria-pressed:border-brand-200"
                    >
                        <span className="min-w-0 break-words">{item.id === selectedSpendingId && <span aria-hidden="true">✓ </span>}{item.title}</span>
                        <span className="shrink-0 tabular-nums">¥{Number(item.amount).toLocaleString('ja-JP')}</span>
                    </button>
                ))}

                <div aria-live="polite">
                    {selectedSpending && (
                        <div className="space-y-1 rounded-xl bg-[#EAF8F1] p-3 text-sm text-[#113A28] dark:bg-brand-800/40 dark:text-brand-200">
                            <p className="break-words font-bold">選んだ支出：{selectedSpending.title}</p>
                            <p>次も大事にしたいのは、どんな使い方ですか？</p>
                            <p className="text-xs">思い浮かべるだけで大丈夫です。理由の入力・保存はありません。</p>
                        </div>
                    )}
                </div>
            </div>
        </details>
    );
}

function FilterButton({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`min-h-11 flex-1 rounded-full px-2 py-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${active ? 'bg-brand-700 text-white dark:bg-brand-200 dark:text-neutral-950' : 'bg-white text-neutral-700 ring-1 ring-inset ring-neutral-400 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-600'}`}
        >
            {children}
        </button>
    );
}

function TransactionCard({ transaction }) {
    const isIncome = transaction.type === 'income';

    return (
        <article className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div
                aria-hidden="true" className={`h-8 w-8 shrink-0 rounded-full ${
                    isIncome ? 'bg-purple-100' : 'bg-emerald-50'
                }`}
            />

            <div className="min-w-0 flex-1">
                <h3 className="break-words text-sm font-bold">
                    {transaction.title}
                </h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-neutral-300">
                    {transaction.category}
                </p>
            </div>

            <p
                className={`shrink-0 text-sm font-bold tabular-nums ${
                    isIncome ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'
                }`}
            >
                {isIncome ? '+' : '-'}¥{Number(transaction.amount).toLocaleString()}
            </p>
        </article>
    );
}

function formatDate(dateText) {
    const [year, month, day] = dateText.slice(0, 10).split('-');
    return `${year}年${Number(month)}月${Number(day)}日`;
}
