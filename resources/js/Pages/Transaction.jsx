// resources/js/Pages/Transaction.jsx
// Shows the mobile transaction list screen.
// Exists so users can search and filter income and expense transactions.
// RELATED FILES: app/Http/Controllers/TransactionController.php, resources/js/Layouts/AuthenticatedLayout.jsx, routes/web.php

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Transaction({
    transactions = [],
    filters = { search: '', type: 'all' },
    currentMonth = '',
}) {
    const [search, setSearch] = useState(filters.search ?? '');

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
            <Head title="取引一覧" />

            <section className="mx-auto max-w-md px-5 pb-8 pt-8 text-neutral-900 dark:text-neutral-100">
                <h1 className="text-3xl font-bold">取引一覧</h1>
                <p className="mt-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                    {currentMonth}
                </p>

                <form onSubmit={submitSearch} className="mt-6">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="店舗名・金額で検索"
                        className="w-full rounded-full border-0 bg-white px-6 py-4 text-sm font-semibold text-neutral-700 placeholder:text-neutral-500 focus:ring-2 focus:ring-brand-500 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:ring-brand-300"
                    />
                </form>

                <div className="mt-5 flex flex-wrap gap-3">
                    <FilterButton
                        active={filters.type === 'all'}
                        color="green"
                        onClick={() => applyFilters({ type: 'all' })}
                    >
                        すべて
                    </FilterButton>
                    <FilterButton
                        active={filters.type === 'expense'}
                        color="pink"
                        onClick={() => applyFilters({ type: 'expense' })}
                    >
                        支出
                    </FilterButton>
                    <FilterButton
                        active={filters.type === 'income'}
                        color="blue"
                        onClick={() => applyFilters({ type: 'income' })}
                    >
                        収入
                    </FilterButton>
                </div>

                <div className="mt-8 space-y-8">
                    {Object.entries(groupedTransactions).map(([date, items]) => (
                        <section key={date}>
                            <h2 className="text-base font-bold text-neutral-600 dark:text-neutral-400">
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
        </AuthenticatedLayout>
    );
}

function FilterButton({ active, color, onClick, children }) {
    const colors = {
        green: active
            ? 'bg-brand-700 text-white dark:bg-brand-300 dark:text-neutral-950'
            : 'bg-brand-50 text-brand-800 dark:bg-brand-800/30 dark:text-brand-300',
        pink: active
            ? 'bg-pink-700 text-white dark:bg-pink-300 dark:text-neutral-950'
            : 'bg-pink-50 text-pink-800 dark:bg-pink-950/50 dark:text-pink-200',
        blue: active
            ? 'bg-blue-700 text-white dark:bg-blue-300 dark:text-neutral-950'
            : 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
    };

    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={`rounded-full px-7 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-brand-300 dark:focus-visible:ring-offset-neutral-950 ${colors[color]}`}
        >
            {children}
        </button>
    );
}

function TransactionCard({ transaction }) {
    const isIncome = transaction.type === 'income';

    return (
        <article className="flex items-center rounded-3xl border border-neutral-200 bg-white px-6 py-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
            <div
                className={`h-10 w-10 rounded-full ${
                    isIncome ? 'bg-purple-100 dark:bg-purple-900/40' : 'bg-emerald-50 dark:bg-emerald-900/40'
                }`}
            />

            <div className="ml-5 min-w-0 flex-1">
                <h3 className="truncate text-base font-bold">
                    {transaction.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                    {transaction.category}
                </p>
            </div>

            <p
                className={`ml-4 text-base font-extrabold ${
                    isIncome ? 'text-blue-700 dark:text-blue-300' : 'text-pink-700 dark:text-pink-300'
                }`}
            >
                {isIncome ? '+' : '-'}¥{Number(transaction.amount).toLocaleString()}
            </p>
        </article>
    );
}

function formatDate(dateText) {
    const date = new Date(dateText);

    return `${date.getMonth() + 1}月${date.getDate()}日`;
}
