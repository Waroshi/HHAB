import ExpenseForm from '@/Components/ExpenseForm';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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

    // 現在の読み取り結果をコピーし、指定された項目だけを書き換える。
    // 元の state は直接変更せず、新しいオブジェクトを React に渡す。
    const updateReceipt = (field, value) => {
        setReceipt((currentReceipt) => {
            const nextReceipt = { ...currentReceipt };
            nextReceipt[field] = value;

            return nextReceipt;
        });
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
                    <ExpenseForm
                        values={receipt}
                        onChange={updateReceipt}
                        isEditing={isEditing}
                        basicHeading={<h2 className="text-base font-bold">レシート基本情報</h2>}
                        otherHeading={<h2 className="text-base font-bold">カテゴリ・その他</h2>}
                    />

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
