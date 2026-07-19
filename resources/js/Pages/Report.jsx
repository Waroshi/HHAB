import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const categoryColorClassNames = {
    food: 'bg-brand-500',
    daily: 'bg-pink-400',
    transport: 'bg-amber-400',
    entertainment: 'bg-violet-400',
    other: 'bg-neutral-400',
};

// TODO: API連携後はサーバーから受け取ったレポートデータを表示する。
const demoReport = {
    month: '2026年5月',
    categories: [
        { key: 'food', name: '食費', percentage: 40 },
        { key: 'daily', name: '日用品', percentage: 20 },
        { key: 'transport', name: '交通費', percentage: 20 },
        { key: 'entertainment', name: '娯楽', percentage: 10 },
        { key: 'other', name: 'その他', percentage: 10 },
    ],
    advice: {
        message: '外食費が先月より増えています',
        increasedAmount: 5600,
        savingSuggestion: '自炊を2回増やすと約¥3,000節約',
    },
};

const clampPercentage = (percentage) => {
    const numericPercentage = Number(percentage);

    if (!Number.isFinite(numericPercentage)) {
        return 0;
    }

    return Math.min(100, Math.max(0, numericPercentage));
};

export default function Report({ report = demoReport }) {
    const reportAdvice = report?.advice ?? {};
    const categories = Array.isArray(report?.categories)
        ? report.categories
        : demoReport.categories;
    const increasedAmount = Number(reportAdvice.increasedAmount);
    const formattedIncreasedAmount = Math.max(
        0,
        Number.isFinite(increasedAmount)
            ? increasedAmount
            : demoReport.advice.increasedAmount,
    ).toLocaleString('ja-JP');

    return (
        <AuthenticatedLayout>
            <Head title="レポート" />

            <div className="mx-auto max-w-md px-5 pb-8 pt-4 text-neutral-900 dark:text-neutral-100">
                <header className="pb-3">
                    <h1 className="text-2xl font-bold">AIアドバイス</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {report?.month ?? demoReport.month}
                    </p>
                </header>

                <Card className="p-5">
                    <h2 className="text-base font-bold">今月の支出内訳</h2>

                    <div className="mt-4 grid grid-cols-2 gap-2 overflow-hidden">
                        <div
                            className={`flex min-h-44 min-w-0 flex-col items-center justify-center rounded-2xl p-3 text-center text-neutral-950 ${categoryColorClassNames[categories[0].key] ?? categoryColorClassNames.other}`}
                        >
                            <p className="max-w-full break-words text-sm font-bold leading-tight">
                                {categories[0].name}
                            </p>
                            <p className="mt-2 max-w-full text-3xl font-extrabold leading-none tabular-nums">
                                {clampPercentage(categories[0].percentage)}%
                            </p>
                        </div>

                        <div className="grid min-w-0 grid-cols-2 grid-rows-2 gap-2">
                            {categories.slice(1).map((category) => (
                                <div
                                    key={category.key}
                                    className={`flex min-w-0 flex-col items-center justify-center rounded-xl p-2 text-center text-neutral-950 ${categoryColorClassNames[category.key] ?? categoryColorClassNames.other}`}
                                >
                                    <p className="max-w-full break-words text-xs font-bold leading-tight">
                                        {category.name}
                                    </p>
                                    <p className="mt-1 max-w-full text-lg font-extrabold leading-none tabular-nums">
                                        {clampPercentage(category.percentage)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="mt-4 border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
                    <h2 className="text-base font-bold text-amber-700 dark:text-amber-300">
                        節約アドバイス
                    </h2>
                    <p className="mt-3 text-sm font-medium">
                        {reportAdvice.message ?? demoReport.advice.message}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-700 tabular-nums dark:text-amber-300">
                        +¥{formattedIncreasedAmount}
                    </p>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {reportAdvice.savingSuggestion ??
                            demoReport.advice.savingSuggestion}
                    </p>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
