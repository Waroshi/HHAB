
import BottomNavbar from '@/Components/BottomNavbar';
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
        <main className="min-h-screen bg-white px-5 pb-24 pt-8">
            <Head title="取引一覧" />

            <section className="mx-auto max-w-md">
                <h1 className="text-3xl font-bold text-gray-900">取引一覧</h1>
                <p className="mt-2 text-sm font-semibold text-gray-400">
                    {currentMonth}
                </p>

                <form onSubmit={submitSearch} className="mt-6">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="店舗名・金額で検索"
                        className="w-full rounded-full border-0 bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-[#50C868]"
                    />
                </form>

                <div className="mt-5 flex gap-3">
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
                            <h2 className="text-base font-bold text-gray-400">
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

            {/* <BottomNavbar /> */}
        </main>
    );
}

function FilterButton({ active, color, onClick, children }) {
    const colors = {
        green: active
            ? 'bg-[#4CB982] text-white'
            : 'bg-[#EAF8F1] text-[#4CB982]',
        pink: active
            ? 'bg-pink-400 text-white'
            : 'bg-pink-50 text-pink-400',
        blue: active
            ? 'bg-blue-400 text-white'
            : 'bg-blue-50 text-blue-400',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-7 py-3 text-sm font-bold ${colors[color]}`}
        >
            {children}
        </button>
    );
}

function TransactionCard({ transaction }) {
    const isIncome = transaction.type === 'income';

    return (
        <article className="flex items-center rounded-3xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
            <div
                className={`h-10 w-10 rounded-full ${
                    isIncome ? 'bg-purple-100' : 'bg-emerald-50'
                }`}
            />

            <div className="ml-5 min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-gray-900">
                    {transaction.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-gray-400">
                    {transaction.category}
                </p>
            </div>

            <p
                className={`ml-4 text-base font-extrabold ${
                    isIncome ? 'text-blue-400' : 'text-pink-400'
                }`}
            >
                {isIncome ? '+' : '-'}¥{Number(transaction.amount).toLocaleString()}
            </p>
        </article>
    );
}

function formatDate(dateText) {
    const [year, month, day] = dateText.split('-');

    return `${Number(year)}年${Number(month)}月${Number(day)}日`;
}
