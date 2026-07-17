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

            <div className="mx-auto max-w-2xl px-5 py-6 text-neutral-900 dark:text-neutral-100">
                <header>
                    <p className="text-sm font-bold text-brand-600 dark:text-brand-300">
                        AI読み取り完了
                    </p>
                    <h1 className="mt-1 text-2xl font-bold">読み取り結果</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        内容を確認して保存してください
                    </p>
                </header>

                <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="storeName" value="店舗名" />
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
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div>
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
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="totalAmount" value="合計金額" />
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
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div>
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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"
                            >
                                {CATEGORY_OPTIONS.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"
                            >
                                {PAYMENT_METHOD_OPTIONS.map((paymentMethod) => (
                                    <option
                                        key={paymentMethod}
                                        value={paymentMethod}
                                    >
                                        {paymentMethod}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="memo" value="メモ" />
                            <textarea
                                id="memo"
                                rows="4"
                                value={receipt.memo}
                                onChange={(event) =>
                                    updateReceipt('memo', event.target.value)
                                }
                                readOnly={!isEditing}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 read-only:bg-neutral-100 read-only:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300"
                            />
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            現在はデモ表示のため、入力内容は保存されません。
                        </p>

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <SecondaryButton
                                type="button"
                                onClick={() =>
                                    setIsEditing((editing) => !editing)
                                }
                            >
                                {isEditing ? '編集をやめる' : '編集する'}
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                            >
                                保存する
                            </PrimaryButton>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
