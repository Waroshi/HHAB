import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const CATEGORY_OPTIONS = ['食費', '日用品', '交通費', '娯楽', 'その他'];
const PAYMENT_METHOD_OPTIONS = [
    '現金',
    'クレジットカード',
    '電子マネー',
    'その他',
];

const demoReceipt = {
    storeName: 'スーパー〇〇',
    purchasedAt: '2026-05-12',
    totalAmount: 3280,
    category: '食費',
    paymentMethod: '現金',
    memo: '',
};

export default function ReadingResult() {
    const [isEditing, setIsEditing] = useState(false);
    const [receipt, setReceipt] = useState(demoReceipt);

    const updateReceipt = (field, value) => {
        setReceipt((currentReceipt) => ({
            ...currentReceipt,
            [field]: value,
        }));
    };

    const submit = (event) => {
        event.preventDefault();
        router.visit(route('dashboard'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="読み取り結果" />

            <div className="mx-auto max-w-md px-4 pb-8 pt-6 text-neutral-900 dark:text-neutral-100 sm:px-5">
                <header>
                    <p className="text-sm font-bold text-brand-600 dark:text-brand-300">
                        デモの読み取り結果
                    </p>
                    <h1 className="mt-1 text-2xl font-bold">読み取り結果</h1>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                        固定データの内容を確認し、必要に応じて編集できます。
                    </p>
                </header>

                <aside
                    role="note"
                    className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/40"
                >
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                        デモ表示・未保存
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                        この画面の入力内容はDBには保存されません。
                    </p>
                </aside>

                <form onSubmit={submit} className="mt-4 space-y-4">
                    <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="text-base font-bold">レシート基本情報</h2>

                        <div className="mt-4 space-y-4">
                            <div className="min-w-0">
                                <InputLabel
                                    htmlFor="storeName"
                                    value="店舗名"
                                />
                                <TextInput
                                    id="storeName"
                                    value={receipt.storeName}
                                    onChange={(event) =>
                                        updateReceipt(
                                            'storeName',
                                            event.target.value,
                                        )
                                    }
                                    readOnly={!isEditing}
                                    className="mt-1 block min-h-11 w-full min-w-0 break-words read-only:bg-neutral-100 read-only:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300 dark:focus-visible:ring-brand-300"
                                />
                            </div>

                            <div className="min-w-0">
                                <InputLabel htmlFor="purchasedAt" value="日付" />
                                <TextInput
                                    id="purchasedAt"
                                    type="date"
                                    value={receipt.purchasedAt}
                                    onChange={(event) =>
                                        updateReceipt(
                                            'purchasedAt',
                                            event.target.value,
                                        )
                                    }
                                    readOnly={!isEditing}
                                    className="mt-1 block min-h-11 w-full min-w-0 read-only:bg-neutral-100 read-only:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300 dark:focus-visible:ring-brand-300"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="min-w-0 rounded-2xl border border-brand-200 bg-brand-50 p-4 shadow-sm dark:border-brand-800 dark:bg-brand-800/20">
                        <InputLabel
                            htmlFor="totalAmount"
                            value="合計金額"
                            className="font-bold text-brand-800 dark:text-brand-200"
                        />
                        <div className="relative mt-2 min-w-0">
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xl font-bold text-brand-700 dark:text-brand-200"
                            >
                                ¥
                            </span>
                            <TextInput
                                id="totalAmount"
                                type="number"
                                min="0"
                                value={receipt.totalAmount}
                                onChange={(event) =>
                                    updateReceipt(
                                        'totalAmount',
                                        event.target.value,
                                    )
                                }
                                readOnly={!isEditing}
                                className="block min-h-12 w-full min-w-0 pl-8 text-xl font-bold tabular-nums text-brand-800 read-only:bg-white read-only:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-900 dark:read-only:text-brand-200 dark:focus-visible:ring-brand-300"
                            />
                        </div>
                    </section>

                    <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="text-base font-bold">カテゴリ・その他</h2>

                        <div className="mt-4 space-y-4">
                            <div className="min-w-0">
                                <InputLabel htmlFor="category" value="カテゴリ" />
                                <select
                                    id="category"
                                    value={receipt.category}
                                    onChange={(event) =>
                                        updateReceipt(
                                            'category',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isEditing}
                                    className="mt-1 block min-h-11 w-full min-w-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"
                                >
                                    {CATEGORY_OPTIONS.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="min-w-0">
                                <InputLabel
                                    htmlFor="paymentMethod"
                                    value="支払い方法"
                                />
                                <select
                                    id="paymentMethod"
                                    value={receipt.paymentMethod}
                                    onChange={(event) =>
                                        updateReceipt(
                                            'paymentMethod',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isEditing}
                                    className="mt-1 block min-h-11 w-full min-w-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"
                                >
                                    {PAYMENT_METHOD_OPTIONS.map(
                                        (paymentMethod) => (
                                            <option
                                                key={paymentMethod}
                                                value={paymentMethod}
                                            >
                                                {paymentMethod}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            <div className="min-w-0">
                                <InputLabel htmlFor="memo" value="メモ" />
                                <textarea
                                    id="memo"
                                    rows="4"
                                    value={receipt.memo}
                                    onChange={(event) =>
                                        updateReceipt('memo', event.target.value)
                                    }
                                    readOnly={!isEditing}
                                    className="mt-1 block min-h-28 w-full min-w-0 resize-y rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 read-only:bg-neutral-100 read-only:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
                        <SecondaryButton
                            type="button"
                            onClick={() =>
                                setIsEditing((editing) => !editing)
                            }
                            className="min-h-12 w-full justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-300"
                        >
                            {isEditing ? '編集をやめる' : '編集する'}
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            className="min-h-12 w-full justify-center bg-brand-600 hover:bg-brand-700 focus:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus:bg-brand-400 dark:focus-visible:ring-brand-300 dark:focus-visible:ring-offset-neutral-950"
                        >
                            保存する
                        </PrimaryButton>
                    </div>

                    <p className="px-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                        「保存する」を選ぶと、内容を保存せずDashboardへ戻ります。
                    </p>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
