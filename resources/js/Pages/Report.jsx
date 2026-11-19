import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const categoryColorClassNames = {
    food: 'bg-brand-500',
    daily: 'bg-pink-400',
    transport: 'bg-amber-400',
    entertainment: 'bg-violet-400',
    other: 'bg-neutral-400',
};

// showDemo: true が明示され、report が未指定のときだけ使う確認用データ。
const demoReport = {
    month: '2026年5月',
    categories: [
        { key: 'food', name: '食費', amount: 4000 },
        { key: 'daily', name: '日用品', amount: 2000 },
        { key: 'transport', name: '交通費', amount: 2000 },
        { key: 'entertainment', name: '娯楽', amount: 1000 },
        { key: 'other', name: 'その他', amount: 1000 },
    ],
};

// 追加カテゴリも、配列の順番ではなく変わらないkeyから色を決める。
const additionalCategoryColors = [
    'bg-sky-400', 'bg-lime-400', 'bg-orange-400', 'bg-teal-400',
];

function getCategoryColor(key) {
    if (Object.hasOwn(categoryColorClassNames, key)) return categoryColorClassNames[key];

    let colorIndex = 0;
    for (const character of key) {
        colorIndex = (colorIndex * 31 + character.codePointAt(0)) % additionalCategoryColors.length;
    }
    return additionalCategoryColors[colorIndex];
}

// 既存の「2026年5月」と「2026-05」を受け取る。欠けた月をデモで補完しない。
function formatReportMonth(month) {
    if (typeof month !== 'string') return null;
    const match = month.match(/^(\d{4})(?:-(0[1-9]|1[0-2])|年(1[0-2]|[1-9])月)$/);
    if (!match || Number(match[1]) === 0) return null;
    return `${Number(match[1])}年${Number(match[2] ?? match[3])}月`;
}

// 金額は数値か10進数の文字列。null・真偽値・空文字などは0円に変換しない。
// 同じkeyは合算し、0円以下・不正値は集計から除く。受け取った配列は変更しない。
function collectPositiveSpending(categories) {
    const categoriesByKey = new Map();
    if (!Array.isArray(categories)) return [];

    for (const category of categories) {
        if (!category || typeof category.key !== 'string' || !category.key.trim()
            || typeof category.name !== 'string' || !category.name.trim()) continue;

        const rawAmount = category.amount;
        const isNumericString = typeof rawAmount === 'string'
            && /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(rawAmount.trim());
        if (typeof rawAmount !== 'number' && !isNumericString) continue;

        const amount = Number(rawAmount);
        if (!Number.isFinite(amount) || amount <= 0) continue;

        const existingCategory = categoriesByKey.get(category.key);
        if (existingCategory) {
            existingCategory.amount += amount;
        } else {
            categoriesByKey.set(category.key, {
                key: category.key, name: category.name.trim(), amount,
                colorClassName: getCategoryColor(category.key),
            });
        }
    }

    return [...categoriesByKey.values()].sort((first, second) =>
        second.amount - first.amount || first.key.localeCompare(second.key),
    );
}

function formatAmount(amount) {
    return amount.toLocaleString('ja-JP', { maximumSignificantDigits: 16 });
}

// 表示だけ小数1桁に丸める。小さな正の割合を「0%」と表示しない。
function formatPercentage(percentage) {
    return percentage < 0.1 ? '0.1%未満' : `${percentage.toFixed(1)}%`;
}

// 合計が半分に近くなる位置で2組に分け、枠の長い辺を金額比で分割する。
// 各組でも同じ分割を繰り返すと、四角の面積が支出割合と一致する。
// 座標は0〜100の百分率。余白を挟まず、丸め前の値で配置する。
function buildSpendingRectangles(categories, x = 0, y = 0, width = 100, height = 100) {
    if (categories.length === 0) return [];
    if (categories.length === 1) return [{ ...categories[0], x, y, width, height }];

    const total = categories.reduce((sum, category) => sum + category.amount, 0);
    const halfTotal = total / 2;
    let splitIndex = 1;
    let firstGroupTotal = categories[0].amount;
    let runningTotal = firstGroupTotal;

    for (let index = 1; index < categories.length - 1; index++) {
        runningTotal += categories[index].amount;
        const candidateDifference = Math.abs(halfTotal - runningTotal);
        const bestDifference = Math.abs(halfTotal - firstGroupTotal);
        if (candidateDifference < bestDifference) {
            splitIndex = index + 1;
            firstGroupTotal = runningTotal;
        }
    }

    const firstGroup = categories.slice(0, splitIndex);
    const secondGroup = categories.slice(splitIndex);
    const firstGroupRatio = firstGroupTotal / total;

    if (width >= height) {
        const firstWidth = width * firstGroupRatio;
        return [
            ...buildSpendingRectangles(firstGroup, x, y, firstWidth, height),
            ...buildSpendingRectangles(secondGroup, x + firstWidth, y, width - firstWidth, height),
        ];
    }

    const firstHeight = height * firstGroupRatio;
    return [
        ...buildSpendingRectangles(firstGroup, x, y, width, firstHeight),
        ...buildSpendingRectangles(secondGroup, x, y + firstHeight, width, height - firstHeight),
    ];
}

// Inertia props: report = { month: '2026-05', categories: [{ key, name, amount }], comparison? }
// report未指定/nullは未接続。categories: []は受信済み0件。showDemoは明示的なデモ専用。
export default function Report({ report, showDemo = false, isGuest = false }) {
    const isDemo = report === undefined && showDemo === true;
    const spendingReport = isDemo ? demoReport : report;
    const isDisconnected = spendingReport == null;
    const monthLabel = formatReportMonth(spendingReport?.month);
    const hasValidDataShape = monthLabel !== null && Array.isArray(spendingReport?.categories);
    const categories = collectPositiveSpending(spendingReport?.categories);
    const totalSpending = categories.reduce((sum, category) => sum + category.amount, 0);
    const hasValidTotal = Number.isFinite(totalSpending) && totalSpending <= Number.MAX_SAFE_INTEGER;
    const rectangles = hasValidDataShape && hasValidTotal
        ? buildSpendingRectangles(categories)
        : [];

    // 未接続や不正データを「支出0件」と表示しないよう、先に判定する。
    let spendingDisplayState = 'ready';
    if (isDisconnected) {
        spendingDisplayState = 'disconnected';
    } else if (!hasValidDataShape || !hasValidTotal) {
        spendingDisplayState = 'invalid';
    } else if (categories.length === 0) {
        spendingDisplayState = 'empty';
    }

    let spendingDescription = 'この月に記録した支出の内訳です。未記録の支出は含みません。';
    if (isDemo) {
        spendingDescription = 'デモ表示：支出内訳は2026年5月の確認用データです';
    } else if (isDisconnected) {
        spendingDescription = '支出内訳は未接続です。対象月とカテゴリ別の支出データを受け取ると表示します。';
    } else if (isGuest) {
        spendingDescription = 'ログインすると、自分が記録した支出の内訳を確認できます。';
    }

    const comparison = spendingReport?.comparison;

    return (
        <AuthenticatedLayout>
            <Head title="レポート" />

            <div className="mx-auto max-w-md px-5 pb-8 pt-4 text-neutral-900 dark:text-neutral-100">
                <header className="pb-3">
                    <h1 className="text-2xl font-bold">レポート</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {monthLabel ?? '対象月未設定'}
                    </p>
                </header>
                {!isDemo && /^\d{4}-\d{2}$/.test(report?.month ?? '') && <label className="mb-4 block text-sm">表示する月
                    <input type="month" value={report.month} min="1900-01" max="9998-12" onChange={(event) => {
                        if (event.target.value) router.get(route('reports.index'), { month: event.target.value }, { preserveScroll: true });
                    }} className="mt-1 block min-h-11 w-full rounded-lg border-neutral-400 bg-white text-sm dark:border-neutral-600 dark:bg-neutral-900 dark:[color-scheme:dark]" />
                </label>}

                <p className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
                    {spendingDescription}
                    {isGuest && <Link href={route('login')} className="ml-2 underline">ログイン</Link>}
                </p>

                <Card className="p-5">
                    <h2 className="text-base font-bold">
                        {monthLabel ? `${monthLabel}の支出内訳` : '支出内訳'}
                    </h2>

                    {spendingDisplayState === 'disconnected' && (
                        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
                            支出データはまだ接続されていません
                        </p>
                    )}
                    {spendingDisplayState === 'invalid' && (
                        <p role="status" className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
                            対象月・カテゴリ別金額のデータ形式、または金額の上限を確認してください
                        </p>
                    )}
                    {spendingDisplayState === 'ready' && (
                        <>
                            <p className="mt-3 text-sm font-semibold tabular-nums">
                                合計 ¥{formatAmount(totalSpending)}
                            </p>
                            <div
                                role="img"
                                aria-label={`${monthLabel}の支出内訳。四角の面積は支出割合を表します。金額と割合は下の一覧で確認できます。`}
                                className="relative mt-4 aspect-[6/5] w-full overflow-hidden min-[375px]:aspect-[4/3]"
                            >
                                {rectangles.map((rectangle) => (
                                    <div
                                        key={rectangle.key}
                                        aria-hidden="true"
                                        title={`${rectangle.name}：¥${formatAmount(rectangle.amount)}（${formatPercentage(rectangle.amount / totalSpending * 100)}）`}
                                        className={`absolute overflow-hidden text-neutral-950 ring-1 ring-inset ring-white/70 dark:ring-neutral-950/70 ${rectangle.colorClassName}`}
                                        style={{
                                            left: `${rectangle.x}%`,
                                            top: `${rectangle.y}%`,
                                            width: `${rectangle.width}%`,
                                            height: `${rectangle.height}%`,
                                        }}
                                    >
                                        {/* 狭い四角は文字を省略する。全項目の詳細は下の一覧に残す。 */}
                                        {rectangle.width >= 25 && rectangle.height >= 18 && (
                                            <div className="flex h-full min-w-0 flex-col justify-center overflow-hidden p-1 text-center text-[10px] font-bold leading-tight sm:text-xs">
                                                <span className="truncate">{rectangle.name}</span>
                                                <span className="truncate tabular-nums">
                                                    {formatPercentage(rectangle.amount / totalSpending * 100)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <ul aria-label="カテゴリ別の支出金額と割合" className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
                                {categories.map((category) => (
                                    <li
                                        key={category.key}
                                        className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-3 py-3 text-sm"
                                    >
                                        <span className="flex min-w-0 items-start gap-2">
                                            <span aria-hidden="true" className={`mt-1 size-3 shrink-0 rounded-sm ${category.colorClassName}`} />
                                            <span className="min-w-0 break-words font-medium">{category.name}</span>
                                        </span>
                                        <span className="flex min-w-0 flex-wrap items-baseline justify-end gap-x-2 break-words text-right tabular-nums">
                                            <span className="min-w-0 font-semibold">¥{formatAmount(category.amount)}</span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {formatPercentage(category.amount / totalSpending * 100)}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                割合は小数1桁に丸めています。合計が100%にならない場合があります。面積は丸め前の割合です。0円以下・不正な金額は集計対象外です。
                            </p>
                        </>
                    )}
                    {spendingDisplayState === 'empty' && (
                        <p className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-5 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
                            {isGuest ? 'ログイン前のため、内訳は表示していません。' : 'この月の支出の記録はありません。'}
                        </p>
                    )}
                </Card>

                {comparison && !isGuest && <Card className="mt-4 border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
                    <h2 className="text-base font-bold text-amber-700 dark:text-amber-300">
                        記録から分かること
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed">{monthLabel}の「{comparison.category}」の記録額は、{comparison.previousMonth}より¥{Number(comparison.difference).toLocaleString('ja-JP')}多くなっています。</p>
                    <p className="mt-2 text-xs tabular-nums">前月 ¥{Number(comparison.previousAmount).toLocaleString('ja-JP')} → 対象月 ¥{Number(comparison.currentAmount).toLocaleString('ja-JP')}</p>
                    <p className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">両月に記録された分だけの比較です。記録漏れや件数の違いも影響するため、節約の成果や満足度を示すものではありません。</p>
                </Card>}
            </div>
        </AuthenticatedLayout>
    );
}
