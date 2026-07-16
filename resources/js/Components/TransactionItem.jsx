const CATEGORY_COLOR_CLASS_NAMES = {
    食費: 'bg-brand-50 text-brand-700 dark:bg-brand-800/40 dark:text-brand-300',
    日用品:
        'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    交通費:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    娯楽: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    給与: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    その他:
        'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
};

function CategoryBadge({ categoryName }) {
    const colorClassName =
        CATEGORY_COLOR_CLASS_NAMES[categoryName] ??
        CATEGORY_COLOR_CLASS_NAMES.その他;
    const badgeText = categoryName ? categoryName.slice(0, 2) : '?';

    return (
        <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colorClassName}`}
        >
            {badgeText}
        </span>
    );
}

export default function TransactionItem({ transaction }) {
    const {
        date = '',
        store = '取引名なし',
        category = 'その他',
        method = '未設定',
        type = 'expense',
        amount = 0,
    } = transaction ?? {};
    const isIncome = type === 'income';
    const amountSign = isIncome ? '+' : '-';
    const amountColorClassName = isIncome
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-expense dark:text-red-400';
    const numericAmount = Number(amount);
    const formattedAmount = Math.abs(
        Number.isFinite(numericAmount) ? numericAmount : 0,
    ).toLocaleString('ja-JP');

    return (
        <article className="flex items-center gap-3 py-3">
            <CategoryBadge categoryName={category} />

            <div className="min-w-0 flex-1">
                <p className="text-[11px] text-neutral-400">{date}</p>
                <p className="truncate text-sm font-bold">{store}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isIncome ? '収入' : '支出'}・{category}・{method}
                </p>
            </div>

            <p
                className={`shrink-0 tabular-nums font-bold ${amountColorClassName}`}
            >
                {amountSign}¥{formattedAmount}
            </p>
        </article>
    );
}
