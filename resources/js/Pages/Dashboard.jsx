// resources/js/Pages/Dashboard.jsx
// Renders the authenticated home dashboard.
// Displays a prototype budget summary and recent transactions.
// RELATED FILES: resources/js/Components/TransactionItem.jsx, resources/js/Layouts/AuthenticatedLayout.jsx, routes/web.php

import Card from '@/Components/Card';
import { ChevronRightIcon, InfoIcon } from '@/Components/Icons';
import TransactionItem from '@/Components/TransactionItem';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// TODO: バックエンド接続後に実際の予算・取引データへ置き換える。
const demoSummary = {
    month: '2026年5月',
    period: '5/1〜5/12 時点',
    usedRatePercent: 68,
    remainingBudget: 19500,
    dailyBudget: 1625,
    adviceMessage:
        '外食費が先月より¥5,600増えています。自炊を増やすと節約につながります。',
    recentTransactions: [
        {
            id: 1,
            date: '5/12（月）',
            store: 'スーパー〇〇〇',
            category: '食費',
            method: '現金',
            type: 'expense',
            amount: 3280,
        },
        {
            id: 2,
            date: '5/10（土）',
            store: 'ドラッグストア△△',
            category: '日用品',
            method: 'カード',
            type: 'expense',
            amount: 1540,
        },
        {
            id: 3,
            date: '5/8（木）',
            store: '給与振込',
            category: '給与',
            method: '銀行',
            type: 'income',
            amount: 77500,
        },
    ],
};

function BudgetProgressRing({ percentage }) {
    const normalizedPercentage = Math.min(
        100,
        Math.max(0, Number(percentage) || 0),
    );
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeOffset =
        circumference * (1 - normalizedPercentage / 100);

    return (
        <div className="relative size-24 shrink-0 sm:size-28">
            <svg
                viewBox="0 0 100 100"
                className="size-full -rotate-90"
                role="img"
                aria-label={`予算使用率${normalizedPercentage}%`}
            >
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    className="stroke-neutral-200 dark:stroke-neutral-800"
                />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    className="stroke-brand-500 transition-[stroke-dashoffset] duration-700"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="tabular-nums text-xl font-extrabold sm:text-2xl">
                    {normalizedPercentage}%
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    予算に対して
                </span>
            </div>
        </div>
    );
}

export default function Dashboard({ summary = demoSummary }) {
    const displaySummary = {
        ...demoSummary,
        ...summary,
        month: summary?.month ?? demoSummary.month,
        period: summary?.period ?? demoSummary.period,
        usedRatePercent:
            summary?.usedRatePercent ?? demoSummary.usedRatePercent,
        remainingBudget:
            summary?.remainingBudget ?? demoSummary.remainingBudget,
        dailyBudget: summary?.dailyBudget ?? demoSummary.dailyBudget,
        adviceMessage: summary?.adviceMessage ?? demoSummary.adviceMessage,
        recentTransactions: Array.isArray(summary?.recentTransactions)
            ? summary.recentTransactions
            : demoSummary.recentTransactions,
    };

    return (
        <AuthenticatedLayout>
            <Head title="ホーム" />

            <div className="px-5 py-6 text-neutral-900 dark:text-neutral-100">
                <div className="mx-auto max-w-md">
                    <div className="mb-4">
                        <h1 className="text-xl font-extrabold tracking-tight">
                            HHAB
                        </h1>
                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            {displaySummary.month}
                        </p>
                    </div>

                    <p className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs leading-relaxed text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                        <span className="font-bold">デモ表示：</span>
                        現在は確認用の固定データを表示しています
                    </p>

                    <Card as="section" className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sm font-bold">
                                今月の状況
                                <InfoIcon
                                    size={15}
                                    className="text-neutral-400"
                                />
                            </div>
                            <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                予算設定
                            </span>
                        </div>

                        <p className="mt-0.5 text-[11px] text-neutral-400">
                            {displaySummary.period}
                        </p>

                        <div className="mt-4 flex items-center gap-3 sm:gap-5">
                            <BudgetProgressRing
                                percentage={displaySummary.usedRatePercent}
                            />

                            <div className="min-w-0 flex-1 space-y-3">
                                <div className="min-w-0">
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                        予算のこり
                                    </p>
                                    <p className="max-w-full break-words text-xl font-extrabold leading-tight tabular-nums text-brand-600 dark:text-brand-300 sm:text-2xl">
                                        ¥
                                        {Number(
                                            displaySummary.remainingBudget,
                                        ).toLocaleString('ja-JP')}
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                        1日あたりの予算
                                    </p>
                                    <p className="max-w-full break-words text-base font-bold leading-tight tabular-nums sm:text-lg">
                                        ¥
                                        {Number(
                                            displaySummary.dailyBudget,
                                        ).toLocaleString('ja-JP')}
                                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                            {' '}
                                            /日
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <section className="mt-4 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                            今月のアドバイス
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                            {displaySummary.adviceMessage}
                        </p>
                    </section>

                    <Card as="section" className="mt-4 p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-bold">最近の取引</h2>
                            <Link
                                href={route('transactions.index')}
                                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-2 text-xs font-bold text-brand-600 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-brand-300 dark:hover:bg-brand-800/40 dark:hover:text-brand-200 dark:focus-visible:ring-brand-300 dark:focus-visible:ring-offset-neutral-900"
                            >
                                すべて見る
                                <ChevronRightIcon size={14} />
                            </Link>
                        </div>

                        {displaySummary.recentTransactions.length > 0 ? (
                            <div className="mt-1 divide-y divide-neutral-100 dark:divide-neutral-800">
                                {displaySummary.recentTransactions.map(
                                    (transaction) => (
                                        <TransactionItem
                                            key={transaction.id}
                                            transaction={transaction}
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-400">
                                最近の取引はありません
                            </p>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
