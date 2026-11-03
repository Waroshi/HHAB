// レシート画像を撮影・選択する画面。カメラを使えるかは端末に依存する。
import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BackIcon } from '../Components/Icons';
import ExpenseForm, { CATEGORY_OPTIONS, PAYMENT_METHOD_OPTIONS } from '@/Components/ExpenseForm';

function createManualExpense() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return {
        storeName: '',
        purchasedAt: `${year}-${month}-${day}`,
        totalAmount: '',
        category: '',
        paymentMethod: '',
        memo: '',
    };
}

function validateManualExpense(expense) {
    const errors = {};
    const date = new Date(`${expense.purchasedAt}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expense.purchasedAt)
        || Number.isNaN(date.getTime())
        || date.toISOString().slice(0, 10) !== expense.purchasedAt) {
        errors.purchasedAt = '日付を正しく入力してください。';
    }

    const amount = expense.totalAmount;
    if (amount === '') {
        errors.totalAmount = '合計金額を入力してください。';
    } else if (!/^[0-9]+$/.test(amount) || Number(amount) <= 0) {
        errors.totalAmount = '金額は1円以上の半角整数で入力してください（0・負数・小数は使えません）。';
    } else if (!Number.isSafeInteger(Number(amount))) {
        errors.totalAmount = '金額が大きすぎます。入力内容を確認してください。';
    }
    if (!CATEGORY_OPTIONS.includes(expense.category)) {
        errors.category = 'カテゴリを選択してください。';
    }
    if (!PAYMENT_METHOD_OPTIONS.includes(expense.paymentMethod)) {
        errors.paymentMethod = '支払い方法を選択してください。';
    }
    return errors;
}

// 四隅のコーナーガイドの配置クラス（左上・右上・左下・右下）
const CORNER_GUIDE_CLASSNAMES = [
    'top-0 left-0 border-t-4 border-l-4 rounded-tl-lg',
    'top-0 right-0 border-t-4 border-r-4 rounded-tr-lg',
    'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg',
    'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg',
];

// 撮影前のプレースホルダーに描く「レシート風の行」の幅（%）
const PLACEHOLDER_LINE_WIDTHS = [84, 66, 90, 48, 72];

export default function Scan() {
    const fileInputRef = useRef(null);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [isReading, setIsReading] = useState(false);
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [manualExpense, setManualExpense] = useState(createManualExpense);
    const [hasChecked, setHasChecked] = useState(false);
    const [checkMessage, setCheckMessage] = useState('');
    const receiptMethodRef = useRef(null);
    const manualEntryButtonRef = useRef(null);
    const previousModeRef = useRef(false);
    const errors = hasChecked ? validateManualExpense(manualExpense) : {};

    useEffect(() => {
        if (isManualEntry !== previousModeRef.current) {
            if (isManualEntry) {
                manualEntryButtonRef.current?.focus();
            } else {
                receiptMethodRef.current?.focus();
            }
        }
        previousModeRef.current = isManualEntry;
    }, [isManualEntry]);

    const updateManualExpense = (field, value) => {
        setManualExpense((currentExpense) => {
            const nextExpense = { ...currentExpense };
            nextExpense[field] = value;
            return nextExpense;
        });
        setCheckMessage('');
    };

    const checkManualExpense = (event) => {
        event.preventDefault();
        setHasChecked(true);
        const nextErrors = validateManualExpense(manualExpense);
        const firstErrorField = Object.keys(nextErrors)[0];
        if (firstErrorField) {
            setCheckMessage('入力内容を確認してください。まだ保存されていません。');
            event.currentTarget.elements.namedItem(firstErrorField)?.focus();
            return;
        }
        setCheckMessage('入力内容に問題はありません。保存機能は未接続のため、まだ保存されていません。');
    };

    // 次のEffect実行前と画面終了時に、前回のObject URLを解放してメモリに残さない。
    useEffect(() => {
        if (!previewImageUrl) {
            return undefined;
        }

        return () => {
            URL.revokeObjectURL(previewImageUrl);
        };
    }, [previewImageUrl]);

    // 選んだ画像はプレビュー用。ここでは画像を送信・解析せず、結果画面へ移動する。
    const handleReceiptSelected = (changeEvent) => {
        const selectedFile = changeEvent.target.files?.[0];
        if (!selectedFile) {
            return;
        }

        const previewUrl = URL.createObjectURL(selectedFile);
        setPreviewImageUrl(previewUrl);

        if (!route().has('readings.result')) {
            return;
        }

        setIsReading(true);
        router.visit(route('readings.result'), {
            onFinish: () => setIsReading(false),
        });
    };

    // 撮影操作から、非表示のファイル入力を発火させる
    const openCamera = () => {
        fileInputRef.current?.click();
    };

    let guideMessage = 'レシートを枠内に合わせてください';
    if (isReading) {
        guideMessage = '読み取り中…';
    }

    const methodButtonClass = 'min-h-14 flex-1 rounded-lg border-2 px-2 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40';
    let selectedMethodClass = 'border-brand-400 bg-brand-800/40 text-white';
    let otherMethodClass = 'border-transparent text-neutral-300 hover:bg-neutral-800';
    let methodGroupClass = 'border-neutral-700 bg-neutral-900';
    if (isManualEntry) {
        selectedMethodClass = 'border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-800/30 dark:text-brand-200';
        otherMethodClass = 'border-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800';
        methodGroupClass = 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900';
    }

    const inputMethodSwitch = (
        <div role="group" aria-label="入力方法" className={`mt-4 flex gap-2 rounded-xl border p-1.5 ${methodGroupClass}`}>
            <button
                ref={receiptMethodRef}
                type="button"
                aria-pressed={!isManualEntry}
                disabled={isReading}
                onClick={() => setIsManualEntry(false)}
                className={`${methodButtonClass} ${isManualEntry ? otherMethodClass : selectedMethodClass}`}
            >
                レシート
                <span className="mt-0.5 block text-xs font-medium">{isManualEntry ? '撮影・画像選択' : '選択中'}</span>
            </button>
            <button
                ref={manualEntryButtonRef}
                type="button"
                aria-pressed={isManualEntry}
                disabled={isReading}
                onClick={() => setIsManualEntry(true)}
                className={`${methodButtonClass} ${isManualEntry ? selectedMethodClass : otherMethodClass}`}
            >
                手入力
                <span className="mt-0.5 block text-xs font-medium">{isManualEntry ? '選択中' : '画像なしで入力'}</span>
            </button>
        </div>
    );

    if (isManualEntry) {
        return (
            <div className="relative mx-auto min-h-dvh max-w-md bg-gray-100 px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:px-5">
                <Head title="支出を手入力" />
                <header>
                    <button
                        type="button"
                        onClick={() => setIsManualEntry(false)}
                        aria-label="レシート画面に戻る"
                        className="absolute left-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 transition hover:bg-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 active:bg-neutral-300 dark:bg-white/10 dark:text-neutral-100 dark:hover:bg-white/15 dark:focus-visible:ring-brand-400 dark:focus-visible:ring-offset-neutral-950 dark:active:bg-white/20"
                    >
                        <span aria-hidden="true">
                            <BackIcon size={20} />
                        </span>
                    </button>
                    <div className="min-h-11 pl-12">
                        <h1 className="text-2xl font-bold">支出を手入力</h1>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">画像なしで、支出の内容を入力できます。</p>
                    </div>
                    {inputMethodSwitch}
                </header>
                <main>
                    <aside className="mt-4 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                        <p><strong>保存機能は未接続です。</strong>再読み込み・別画面への移動で入力が消えます。</p>
                        <p>レシート／手入力の切り替えでは入力を保持します。</p>
                    </aside>
                    <form noValidate onSubmit={checkManualExpense} className="mt-4 space-y-4">
                        <ExpenseForm
                            values={manualExpense}
                            onChange={updateManualExpense}
                            isEditing={true}
                            isManual={true}
                            errors={errors}
                            storeLabel="店舗名・購入先"
                            basicHeading={<h2 className="text-base font-bold">支出の基本情報</h2>}
                            otherHeading={<h2 className="text-base font-bold">カテゴリ・その他</h2>}
                        />
                        <p role="status" className="text-sm text-neutral-700 dark:text-neutral-300">{checkMessage}</p>
                        <button
                            type="submit"
                            className="min-h-12 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 active:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-600 disabled:opacity-40 dark:bg-brand-500 dark:hover:bg-brand-600 dark:focus-visible:ring-brand-300 dark:focus-visible:ring-offset-neutral-950 dark:active:bg-brand-700 dark:disabled:bg-brand-500"
                        >
                            入力内容を確認する
                        </button>
                    </form>
                </main>
            </div>
        );
    }

    return (
        // 撮影画面は常に暗い背景と独自のヘッダーを使うため、共通レイアウトで囲まない。
        <div className="mx-auto flex min-h-dvh max-w-md flex-col overflow-x-hidden bg-neutral-950 text-neutral-100">
            <Head title="レシートを読む" />

            <header className="relative px-4 pb-4 pt-5 sm:px-5">
                <Link
                    href={route('dashboard')}
                    aria-label="戻る"
                    className="absolute left-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:bg-white/20"
                >
                    <span aria-hidden="true">
                        <BackIcon size={20} />
                    </span>
                </Link>

                <div className="px-12 text-center">
                    <h1 className="text-xl font-bold tracking-tight">
                        レシートを読む
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                        レシート全体が写るように撮影してください
                    </p>
                </div>
                {inputMethodSwitch}
            </header>

            <main className="flex flex-1 flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:px-6">
                {/* ---------- 撮影・プレビュー領域 ---------- */}
                <section
                    aria-label="レシート撮影プレビュー"
                    className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-sm"
                >
                    {CORNER_GUIDE_CLASSNAMES.map((cornerClassName) => (
                        <span
                            key={cornerClassName}
                            aria-hidden="true"
                            className={`pointer-events-none absolute z-10 size-8 border-brand-400 ${cornerClassName}`}
                        />
                    ))}

                    <div className="absolute inset-3 flex items-center justify-center overflow-hidden rounded-xl border border-neutral-700/80 bg-neutral-800/80">
                        {previewImageUrl ? (
                            <img
                                src={previewImageUrl}
                                alt="撮影したレシート"
                                className="size-full bg-neutral-950/40 object-contain"
                            />
                        ) : (
                            <div className="flex w-3/4 flex-col items-center px-3 text-center">
                                <svg
                                    aria-hidden="true"
                                    className="size-10 text-neutral-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M7 3h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2V5a2 2 0 0 1 2-2Z" />
                                    <path d="M8 8h8M8 12h8M8 16h5" />
                                </svg>
                                <div className="mt-5 w-full space-y-2.5 opacity-50">
                                    {PLACEHOLDER_LINE_WIDTHS.map((lineWidthPercent) => (
                                        <div
                                            key={lineWidthPercent}
                                            style={{ width: `${lineWidthPercent}%` }}
                                            className="mx-auto h-1.5 rounded bg-neutral-500"
                                        />
                                    ))}
                                </div>
                                <p className="mt-5 text-xs leading-relaxed text-neutral-400">
                                    枠の中にレシート全体を収めてください
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ---------- 画像選択・撮影操作 ---------- */}
                <div className="mt-4">
                    <label htmlFor="receipt-image" className="sr-only">
                        レシート画像
                    </label>
                    <input
                        id="receipt-image"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleReceiptSelected}
                    />
                    <button
                        type="button"
                        aria-label="撮影する"
                        disabled={isReading}
                        onClick={openCamera}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <svg
                            aria-hidden="true"
                            className="size-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
                            <circle cx="12" cy="13" r="3.5" />
                        </svg>
                        レシートを撮影・選択
                    </button>
                </div>

                <p
                    aria-live="polite"
                    className="mt-3 min-h-5 text-center text-sm font-medium text-neutral-300"
                >
                    {guideMessage}
                </p>

                <aside className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900/70 px-4 py-3">
                    <p className="text-xs leading-relaxed text-neutral-400">
                        明るい場所で撮影すると、レシートを確認しやすくなります。
                    </p>
                </aside>
            </main>
        </div>
    );
}
