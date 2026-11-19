import Card from '@/Components/Card';
import { ChevronRightIcon } from '@/Components/Icons';
import TransactionItem from '@/Components/TransactionItem';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ summary, isGuest = false }) {
    const recentTransactions = summary?.recentTransactions ?? [];

    return (
        <AuthenticatedLayout>
            <Head title="ホーム" />
            <div className="mx-auto max-w-md px-5 py-6 text-neutral-900 dark:text-neutral-100">
                <header className="mb-4">
                    <h1 className="text-xl font-bold">お金から、自分を知る。</h1>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">使ってよかったお金を、一つから振り返ってみませんか。</p>
                </header>

                {isGuest ? (
                    <Card as="section" className="p-5">
                        <h2 className="text-base font-bold">記録を始める前に、試してみる</h2>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">取引一覧でサンプルを一つ選ぶだけ。自分が大事にしたい使い方を考えられます。</p>
                        <Link href={route('transactions.index')} className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-brand-200 bg-brand-50 px-3 text-sm font-bold text-brand-700 hover:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-700 dark:bg-brand-800/40 dark:text-brand-200 dark:hover:bg-brand-800">サンプルで振り返りを試す →</Link>
                        <p className="mt-3 flex gap-4 text-sm"><Link className="underline" href={route('login')}>ログイン</Link><Link className="underline" href={route('register')}>新規登録</Link></p>
                    </Card>
                ) : summary ? (
                    <Card as="section" className="p-5">
                        <h2 className="text-sm font-bold">{summary.month}に記録した支出</h2>
                        <p className="mt-4 break-words text-3xl font-bold tabular-nums text-brand-700 dark:text-brand-200">¥{Number(summary.monthlyTotal).toLocaleString('ja-JP')}</p>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{summary.recordCount}件の記録</p>
                        <p className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">記録した分の合計です。記録がない日のお金の使い方は含みません。</p>
                    </Card>
                ) : (
                    <p role="status" className="rounded-xl border p-4 text-sm">支出データを受け取れていません。</p>
                )}

                {!isGuest && <Card as="section" className="mt-4 p-5">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-bold">最近の支出</h2>
                        <Link href={route('transactions.index')} className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-3 text-sm font-bold text-brand-700 hover:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-700 dark:bg-brand-800/40 dark:text-brand-200 dark:hover:bg-brand-800">
                            一覧・振り返り <ChevronRightIcon size={14} />
                        </Link>
                    </div>
                    {recentTransactions.length > 0 ? (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {recentTransactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">まだ支出の記録がありません。下の「読み取り」から入力できます。「一覧・振り返り」ではサンプルも試せます。</p>
                    )}
                </Card>}
            </div>
        </AuthenticatedLayout>
    );
}
